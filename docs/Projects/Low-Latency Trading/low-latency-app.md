---
title: Building a low-latency application
parent: Low-Latency Trading
layout: home
nav_order: 2
---
:warning:   Content in progres...

# Building a low-latency application
Every task incurs some time (unless the task is no task at all). The time between when the task starts and when the task finished is called **latency**. Note this is different to **throughput**, which is the amount of work done per unit of time. Low latency often means high throughput, but high throughput not always means low latency. If you run a bakery and you have one baker who cooks really fast, this baker can be said to have low latency. Because he is able to bake very fast, then he can produce more in the same unit of time (lower latency, higher throughput than otherwise). However, you can also have 5 bakers who are not as fast, but who together produce more per unit of time (higher throughput but higher latency per baked item).

To measure latency of a task in C++ one can use `rdtsc`. 