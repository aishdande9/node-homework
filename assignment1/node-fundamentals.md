# Node.js Fundamentals

## What is Node.js?
Node.js is a runtime that lets you run JavaScript outside the browser, on your computer or a server.

## How does Node.js differ from running JavaScript in the browser?
 read and write files, start a web server, read environment variables, work with operating system services.

## What is the V8 engine, and how does Node use it?
The V8 engine is Google's JavaScript engine that was originally built for the Chrome browser. It reads JavaScript code and converts it into machine code so the computer can execute it quickly.

## What are some key use cases for Node.js?
Some key use cases for Node.js include building web servers, creating REST APIs, developing real-time applications such as chat apps and online games, handling file system operations, automating repetitive tasks, and building command-line tools. Node.js is also widely used for backend development because it can efficiently handle many simultaneous connections.

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

**CommonJS (default in Node.js):**

  CommonJS is the traditional module system used in Node.js. It uses require() to import modules and 
    module.exports to export them.

    // math.js 
    function add(a, b) { return a + b; } module.exports = { add }; 
     // app.js 
     const math = require("./math"); console.log(math.add(2, 3));


**ES Modules (supported in modern Node.js):**
ES Modules are the modern JavaScript module system. They use import to load modules and export to share code. ES Modules work in modern browsers and are also supported in Node.js.
// math.js 
export function add(a, b) { return a + b; } 
// app.js
 import { add } from "./math.js"; console.log(add(2, 3));
