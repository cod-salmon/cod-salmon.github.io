---
title: Low-Latency App
parent: Projects
layout: home
nav_order: 2
---


The project is taken from ["Building Low Latency Applications with C++: Develop a complete low latency trading ecosystem from scratch using modern C++"](https://www.packtpub.com/en-us/product/building-low-latency-applications-with-c-9781837639359), from Sourav Ghosh.

The aim by following his code was:
* to learn new coding standards/ways of writing C++17/20;
* to see C++ applied on a low-latency context; and
* to learn about digital trading ecosystems.

I believe the goals have been achieved and I am confident of the reasons and ways of doing of the code.
Note: apart from extra comments, I've written an additional Markdown file per `.hpp`/`.cpp` pair explaining the respective class and its implementation.

# Low-Latency App
Every task incurs some time (unless the task is no task at all). The time between when the task starts and when the task finished is called **latency**. Note this is different to **throughput**, which is the amount of work done per unit of time. Low latency often means high throughput, but high throughput not always means low latency. If you run a bakery and you have one baker who cooks really fast, this baker can be said to have low latency. Because he is able to bake very fast, then he can produce more in the same unit of time (lower latency, higher throughput than otherwise). However, you can also have 5 bakers who are not as fast, but who together produce more per unit of time (higher throughput but higher latency per baked item).

To measure latency of a task in C++ one can use `rdtsc`. 