// Function to enable dark mode
const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

// Function to disable dark mode
const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.removeItem('darkmode')
}

// Apply whatever the current saved theme is
const darkmodeActive = localStorage.getItem('darkmode') === 'active'
if (darkmodeActive) enableDarkmode()

// Grab the theme-switch button
const themeSwitch = document.getElementById('theme-switch')

// Enable/disable dark mode when clicking theme-switch button
themeSwitch.addEventListener('click', () => {
  if (document.body.classList.contains('darkmode')) {
    disableDarkmode()
  } else {
    enableDarkmode()
  }
})