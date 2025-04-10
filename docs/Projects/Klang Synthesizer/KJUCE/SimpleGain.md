---
title: Simple gain slider
parent: JUCE through Klang
layout: home
nav_order: 1
---
# Simple gain slider
Here I write about how to write a simple gain slider; first, in JUCE; then, in JUCE but through Klang's simple gain dial, defined at `SimpleGain.k`.

## JUCE simple gain slider
When you launch a new Plugin project `SimpleGain` in JUCE, it generates a new folder, where specified, containing the following:
* a `<path>/SimpleGain/Builds` folder
* a `<path>/SimpleGain/JuceLibraryCode` folder
* a `<path>/SimpleGain/Source` folder; and (maybe)
* a `SimpleGain.jucer` file.

The `SimpleGain/Source` folder at the same time comes with the following set of files:
* `PluginEditor.h`
* `PluginEditor.cpp`
* `PluginProcessor.h` and
* `PluginProcessor.cpp`.

The classes will following the naming format (e.g.,) `SimpleGainAudioProcessorEditor`.

### `processBlock`
The actual audio processing is done at `SimpleGainAudioProcessor::processBlock`, which takes a reference to an `AudioBuffer` containing the incoming audio data. `processBlock` modifies this data depending on the type of audio effect desired. An `AudioBuffer` contains floating point audio samples for each of its compounding channels. For instance, for Stereo, we should expect an input `AudioBuffer` consisting of two buffers, for the left and right channels. For instance, the following code lowers the volume down in all input channels:
```
void SimpleGainAudioProcessor::processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages)
{
    // Obtain total number of input channels
    auto totalNumInputChannels  = getTotalNumInputChannels();
    // Loop over each of them
    for (int channel = 0; channel < totalNumInputChannels; ++channel)
    {
        // Obtain the right float chain for the given channel
        float* channelData = buffer.getWritePointer (channel);
        // Loop over the float chain for the given channel, and
        //  for each float in the float chain, multiply it by 0.2.
        for (int i = 0; i < buffer.getNumSamples(); ++i)
            channelData[i] *= 0.2f;
    }
}
```
### Plugin Parameters
Parameters are how plug-in hosts control plug-ins. They are exposed as part of the plug-in format's interface - i.e., you need to specify the parameters in order to specify the plug-in:
```
MyPlugin (parameter1, parameter2, parameter3);
``` 
Parameters can be changed via the plug-in's GUI - you can define the above plug-in in your code, and then have the user through the GUI (say, through some dials) setting up the values for `parameter1`, `parameter2` and `parameter3`. 

In JUCE, parameters are held or wrapped inside the `AudioProcessorParameter` class. This class contains methods for getting and setting the parameter values and properties. Then it can be added to and managed by the AudioProcessor. Some basic types are:
* `AudioParameterFloat`
* `AudioParameterInt`
* `AudioParameterBool`
* `AudioParameterChoice`

Parameters can be added into the plugin by calling `addParameter` in the `SimpleGainAudioProcessor` constructor:
```
SimpleGainAudioProcessor::SimpleGainAudioProcessor()
#ifndef JucePlugin_PreferredChannelConfigurations
     : AudioProcessor (BusesProperties()
                     #if ! JucePlugin_IsMidiEffect
                      #if ! JucePlugin_IsSynth
                       .withInput  ("Input",  juce::AudioChannelSet::stereo(), true)
                      #endif
                       .withOutput ("Output", juce::AudioChannelSet::stereo(), true)
                     #endif
                       )
#endif
{
    // Adds parameter with name "Gain" and ID "gain", with minimum value 0.0f,
    //  maximum value 1.0f, and starting value 1.0f. 
    addParameter (new juce::AudioParameterFloat ("gain", "Gain", 0.0f, 1.0f, 1.0f));
}
```
`addParameter` is a derived method from `AudioProcessor`. `AudioProcessor` keeps an array of `AudioProcessorParameter` pointers, which can be accessed through the method `AudioProcessor::getParameters`. When calling `addParameter(AudioProcessorParameter * parameter)`, what we essentially do is access the xth element in the array of `AudioProcessorParameter` pointers and assign it `parameter`. In the above code, one could instead write:
```
juce::AudioProcessorParameter * parameter = new juce::AudioParameterFloat ("gain", "Gain", 0.0f, 1.0f, 1.0f);
addParameter(parameter);
```
Which element the AudioProcessor decides to access when `addParameter` gets called is (probably) based on some internal variable that keeps track of the last element in the array which has been written into, so that, when `addParameter` gets called the first time, the `parameter` gets assigned to the 0th element in the array; when `addParameter` gets called a second time, the second `parameter` gets assigned to the 1st element in the array; and so on.

To use one of the plug-in's parameters in `processBlock`, we can therefore use the `getParameters` method from the `AudioProcessor` class:
1. by specifying the parameter that we want out of the array of `AudioProcessorParameter` pointers (e.g., `getParameters()[0]` for the first parameter that we added); and
2. by calling `AudioProcessorParameter::getValue` method, which returns the parameter value wrapped inside the `AudioProcessorParameter` class:
```
void SimpleGainAudioProcessor::processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages)
{
    // Obtain total number of input channels
    auto totalNumInputChannels  = getTotalNumInputChannels();

    // Obtain the value for the gain parameter
    juce::AudioProcessorParameter* gainParameter = getParameters()[0];
    float gain = gainParameter->getValue();
    // Loop over each of them
    for (int channel = 0; channel < totalNumInputChannels; ++channel)
    {
        // Obtain the right float chain for the given channel
        float* channelData = buffer.getWritePointer (channel);
        // Loop over the float chain for the given channel, and
        //  for each float in the float chain, multiply it by 0.2.
        for (int i = 0; i < buffer.getNumSamples(); ++i)
            channelData[i] *= gain;
    }
}
```
### `GenericAudioProcessorEditor`
To be able to see this simple gain knob in action, we don't even need to enter into GUI details and start playing around `SimpleGainAudioProcessorEditor::paint` and `SimpleGainAudioProcessorEditor::resize` (see `./PluginEditor.h` and `./PluginEditor.cpp`). There is this short-cut that we can take. Instead of having:
```
juce::AudioProcessorEditor* SimpleGainAudioProcessor::createEditor()
{
    return new SimpleGainAudioProcessorEditor (*this);
}
```
we can use an automatically-generated graphic interface:
```
juce::AudioProcessorEditor* SimpleDelayAudioProcessor::createEditor()
{
    //return new SimpleDelayAudioProcessorEditor (*this);
    return new juce::GenericAudioProcessorEditor (*this);
}
```
which will look at the AudioProcessor that you pass to it, it will look at the types of parameters that you registered in the Audioprocessor and then decide and build for you the right interface for them (for example, it might build a slider for the gain parameter). The code up in branch `SimpleGain`, up to the commit with number `0ac42b1` will show the following plug-in GUI:

![](./../../../../pics/klang-synthesizer/juce/gain-slider-automatic-gui.PNG)

To test the plug-in in Ableton I do the following:
1. Build the VST3 file on JUCE:
    ![](./../../../../pics/klang-synthesizer/juce/build-vst3.PNG) 
2. Go to  `C:\<path>\JUCE-projects\klang-plugin-juce\Builds\VisualStudio2022\x64\Debug\VST3\klang-plugin-juce.vst3\Contents\x86_64-win`, copy the `klang-plugin-juce.vst3` file and bring it into `C:\Program Files\Common Files\VST3`:
    ![](./../../../../pics/klang-synthesizer/juce/ableton-vst3-loc.PNG)
3. Tell Ableton to look into that folder for plug-ins:
    ![](./../../../../pics/klang-synthesizer/juce/ableton-plugin-folder-on.PNG)
4. Add plug-in into a random sample:
    ![](./../../../../pics/klang-synthesizer/juce/ableton-plugin-here.PNG) ![](./../../../../pics/klang-synthesizer/juce/juce-gain-ableton.PNG)

## JUCE simple gain slider through [Klang](https://github.com/nashaudio/klang)
In branch `klang-plugin-juce/SimpleGain`, commit `e4969cc`, I managed to have the same gain slider described above running through Klang.

### Changes in the `PluginProcessor.h`
We include `klang.h`, which enables us to use the Klang language inside JUCE, using their common C++ framework; and we include `SimpleGain.k`, which implements a Gain dial with minimum value of 0.0f, maximum value of 2.0f and default value of 0.25f. Then we add a `SimpleGain` instance called `kgain` as a new member variable of the `SimpleGainAudioProcessor` class.
### Changes in the `SimpleGainAudioProcessor` constructor
Instead of defining the values inside the constructor, we retrieve the parameter values from `kgain`'s Klang `Controls`:
```
//addParameter (new juce::AudioParameterFloat ("gain", "Gain", 0.0f, 1.0f, 1.0f));
//juce::AudioProcessorParameter * parameter = new juce::AudioParameterFloat ("gain", "Gain", 0.0f, 1.0f, 1.0f);
//addParameter(parameter);

// Register Klang SimpleGain's parameters instead
const klang::Control& control = kgain.controls[0];
addParameter(new juce::AudioParameterFloat(0, control.name.c_str(), control.min, control.max, control.initial));
```

### Changes in the `processBlock`
We don't want to process the input audio in JUCE, but we want JUCE to pass the input audio to Klang, so that it processes it accordingly. Therefore we write:
```
void SimpleGainAudioProcessor::processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages)
{
    /* // Obtain total number of input channels
    auto totalNumInputChannels  = getTotalNumInputChannels();

    // Obtain the value for the gain parameter
    juce::AudioProcessorParameter* gainParameter = getParameters()[0];
    float gain = gainParameter->getValue();
    // Loop over each of them
    for (int channel = 0; channel < totalNumInputChannels; ++channel)
    {
        // Obtain the right float chain for the given channel
        float* channelData = buffer.getWritePointer (channel);
        // Loop over the float chain for the given channel, and
        //  for each float in the float chain, multiply it by 0.2.
        for (int i = 0; i < buffer.getNumSamples(); ++i)
            channelData[i] *= gain;
    } */

    // Update the Klang Synth's parameters (may have changed)
    for (unsigned int c = 0; c < kgain.controls.size(); c++)
        kgain.controls[c].set(getParameters()[c]->getValue());

    // Setup the buffers for processing in Klang
    klang::buffer left(buffer.getWritePointer(0), buffer.getNumSamples());
    klang::buffer right(buffer.getWritePointer(1), buffer.getNumSamples());
    
    // Process buffers in Klang's SimpleGain
    kgain.klang::Effect::process(left);
    kgain.klang::Effect::process(right);
}
```

One should now be able to use a Gain slider in Ableton (following the process described above) that goes from 0.0f to 2.0f and defaults to 0.25f:

![](./../../../../pics/klang-synthesizer/juce/kgain-slider-automatic-gui.PNG)