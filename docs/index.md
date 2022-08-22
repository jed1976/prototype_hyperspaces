# Welcome to Hyperspaces
Hyperspaces is a toolkit for people who want to create hypermedia for the Web.

## Basic Info

### Software Requirements
- [Linux](https://www.linux.org/)
- [macOS](https://www.apple.com/macos/catalina/)
- [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/)

### License Agreement
Copyright 2020 Hyperspaces

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Change Log

#### Version 1.0
Release Date: Month Day, Year

First publicly released version.

### Credits
Hyperspaces was designed and developed by David Luhr and Joe Dakroub.

## Introduction

### Getting Started
The first step is to [install](#installation) Hyperspaces, then read all the topics in the [Introduction](#introduction) section of the Table of Contents.

Next, read each of the [General Topics](#general-topics) pages in order. Each topic builds on the previous one, and includes code examples that you are encouraged to try.

### Installation
Hyperspaces ships as a single executable with no dependencies.

You can install it from the shell:

`curl -fsSL https://code.hyperspaces.app/install.sh | sh`

### Hyperspaces at a Glance

#### Hyperspaces is a Web Framework
Hyperspaces is a toolkit for people who want to build projects that run in a Web browser. Its goal is to enable you to develop projects much faster and more accurate than you could if you were writing code from scratch, by providing a rich set of patterns for commonly needed tasks, as well as a simple interface and logical structure to access these patterns. Hyperspaces lets you creatively focus on your project by minimizing the amount of work needed for a given task.

#### Hyperspaces is Free
Hyperspaces is licensed under an MIT open source license so you can use it however you please. For more information please read the [license agreement](#license-agreement).

#### Hyperspaces is Light Weight
Truly light weight. The core system requires only a few very small libraries. This is in stark contrast to many frameworks that require significantly more resources. Additional libraries are loaded dynamically upon request, based on your needs for a given process, so the base system is very lean and quite fast.

#### Hyperspaces is Fast
Really fast. We challenge you to find a framework that has better performance than Hyperspaces.

#### Hyperspaces is built on State Machines
Hyperspaces uses the state machine approach, which allows great separation between logic, presentation and side affects. Every component in your project is backed by a state machine, ensuring your project can never be in an unpredictable state. We describe state machines in more detail on its own page.

#### Hyperspaces Packs a Punch
Hyperspaces comes with full-range of patterns that enable the most commonly needed web development tasks, like accessing a database, sending email, validating form data, maintaining sessions, manipulating images, working with data and much more.

#### Hyperspaces is Extensible
The system can be easily extended through the use of your own libraries, helpers, or through class extensions or system hooks.

#### Hyperspaces is Thoroughly Documented
Programmers love to code and hate to write documentation. We're no different, of course, but since documentation is as important as the code itself, we are committed to doing it. Our source code is extremely clean and well commented as well.

### Supported Features
Features in and of themselves are a very poor way to judge an application since they tell you nothing about the user experience, or how intuitively or intelligently it is designed. Features don't reveal anything about the quality of the code, or the performance, or the attention to detail, or security practices. The only way to really judge an app is to try it and get to know the code. Installing Hyperspaces is child's play so we encourage you to do just that. In the mean time here's a list of Hyperspaces's main features.

- State Machine Based System
- Extremely Light Weight
- Form and Data Validation
- Security and XSS Filtering
- Localization
- Benchmarking
- Error Logging
- Flexible URI Routing
- Large library of "helper" functions

### State Machines
A finite state machine (sometimes called a finite state automaton) is a computation model that can be implemented with hardware or software and can be used to simulate sequential logic and some computer programs.

A system where particular inputs cause particular changes in state can be represented using finite state machines.

Numerous web projects can be built and automated with nothing more than simple state machines composed together to form a larger whole.

### Architectural Goals
Our goal for Hyperspaces is maximum performance, capability, and flexibility in the smallest, lightest possible package.

To meet this goal we are committed to benchmarking, re-factoring, and simplifying at every step of the development process, rejecting anything that doesn't further the stated objective.

From a technical and architectural standpoint, Hyperspaces was created with the following objectives:

- **Dynamic Instantiation.** In Hyperspaces, components are loaded and routines executed only when requested, rather than globally. No assumptions are made by the system regarding what may be needed beyond the minimal core resources, so the system is very light-weight by default. The events, as triggered by the HTTP request, and the controllers and views you design will determine what is invoked.

- **Loose Coupling.** Coupling is the degree to which components of a system rely on each other. The less components depend on each other the more reusable and flexible the system becomes. Our goal was a very loosely coupled system.

- **Component Singularity.** Singularity is the degree to which components have a narrowly focused purpose. In CodeIgniter, each class and its functions are highly autonomous in order to allow maximum usefulness.

Hyperspaces is a dynamically instantiated, loosely coupled system with high component singularity. It strives for simplicity, flexibility, and high performance in a small footprint package.

## Tutorial

### Introduction
### Static pages
### News section
### Create news item
### Conclusion

## General Topics

### Hyperscript
### Components
### Pages


## Additional Resources

## API
