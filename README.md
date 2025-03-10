# What is this project?

Minimalistic framework that, makes it easier to create command line interfaces by defining routes

# Documentation

All documentation related to this project (code, best practices etc...) will be in the [docs folder](./docs)

# Quickstart

## Prerequisities

- node js installed prefferably 20+

## How to run

Run `npm run sandbox:dev-start [args]` command to start sandbox app in project root directory

## How to use

This project is mini framework for building cli apps fast, it enforces some best practices.

To create basic cli app, you need to instanitiate `CliApp` with command line arguments (\*`process.argv`), and then on use `command` method on created object. To `command` you need to pass in a string (It will look for that string in arguments given, when sandbox was run, and if it is found then it will execute a callback). You have to call `end` function with callback as paramater, to separate different paths and ensure that callback is called. [Example](./sandbox/index.ts)

- Make sure to exclude arguments that are passed automatically. Look at [Example](./sandbox/index.ts)

# Usage

This mini-framework is completly free to use, no annotation about creators required.
[License details](./LICENSE).


# Generating log about memory use of app
Open CMD and use command `npm test tests/unit/index.memory-usage-log.test.ts`, in a moment you will see new file in tests/unit/index.memory-usage-log.test.txt where is data about memory use in `.txt`. Open any spreadsheet (For example Excel) and import this file. Next you have to just create chart.