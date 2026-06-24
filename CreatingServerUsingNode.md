# Creating a Server Using Node.js HTTP Module

## Introduction

I studied how to create a web server using Node.js's built-in `http` module. The `http` module allows developers to handle requests and send responses without installing external packages.

## Code Example

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello from Node.js Server!");
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

## Explanation

- `require("http")` imports the HTTP module.
- `http.createServer()` creates a server.
- `req` represents the client's request.
- `res` sends a response back to the client.
- `res.writeHead()` sets the status code and content type.
- `res.end()` sends the response and closes the connection.
- `server.listen(3000)` starts the server on port 3000.

## Conclusion

The Node.js `http` module makes it possible to create a simple server that can receive requests and send responses. It is a fundamental concept in backend development.