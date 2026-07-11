# Node.js Fundamentals

## What is Node.js?
Node.js is a runtime that lets you run JavaScript outside the browser, on your computer or a server.

## How does Node.js differ from running JavaScript in the browser?
 Node.js and browsers both run JavaScript, but they provide different environments and tools. Browser JavaScript is mainly used to create interactive web pages. It can access browser features such as window, document, the DOM, cookies, and browser storage.

Node.js runs JavaScript outside the browser, usually on a computer or server. It does not have window, document, or the DOM because it is not connected to a web page. Instead, Node.js provides access to the file system, operating system information, environment variables, command-line arguments, networking tools, and server-side modules.

For example, Node.js can read and write files or create a web server, while browser JavaScript is restricted from directly accessing a user's computer files for security reasons.

## What is the V8 engine, and how does Node use it?
The V8 engine is Google's JavaScript engine that was originally built for the Chrome browser. It reads JavaScript code and converts it into machine code so the computer can execute it quickly.

## What are some key use cases for Node.js?
Some key use cases for Node.js include building web servers, creating REST APIs, developing real-time applications such as chat apps and online games, handling file system operations, automating repetitive tasks, and building command-line tools. Node.js is also widely used for backend development because it can efficiently handle many simultaneous connections.

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

CommonJS uses require() to import code and module.exports to export code. This course uses CommonJS for Node.js assignments.

mathUtils.js

function add(a, b) {
  return a + b;
}

module.exports = { add };

app.js

const { add } = require('./mathUtils');

console.log(add(2, 3));
ES Modules

ES Modules use import to import code and export to export code. This syntax is commonly used in modern JavaScript applications, including React.

mathUtils.js

export function add(a, b) {
  return a + b;
}

app.js

import { add } from './mathUtils.js';

console.log(add(2, 3));

The main syntax difference is that CommonJS uses require() and module.exports, while ES Modules use import and export. In this Node.js course, I will use CommonJS unless the assignment says otherwise.