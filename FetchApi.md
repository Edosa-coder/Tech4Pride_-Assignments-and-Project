# FETCH API NOTES

## Introduction to Fetch API

Today, I studied the Fetch API in JavaScript. The Fetch API is a modern JavaScript feature used to make HTTP requests to servers. It allows applications to communicate with APIs and exchange data over the internet.

The Fetch API returns a Promise, making it easier to handle asynchronous operations using either `.then()` and `.catch()` methods or the `async/await` syntax.

---

## GET Request

A GET request is used to retrieve or fetch data from a server. It does not modify any data on the server; it simply requests information.

### Example:

```javascript
fetch("https://api.paystack.co")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

### Explanation:

* `fetch()` sends a request to the specified URL.
* The server responds with data.
* `response.json()` converts the response into a JavaScript object.
* The data is then displayed in the console.
* `.catch()` handles any errors that occur during the request.

---

## POST Request

A POST request is used to send data to a server. It is commonly used when creating new records, submitting forms, or uploading information.

### Example:

```javascript
fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: "My First Post",
    body: "Learning Fetch API",
    userId: 1
  })
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

### Explanation:

* `method: "POST"` tells the server that data is being sent.
* `headers` specify the type of data being sent.
* `JSON.stringify()` converts the JavaScript object into JSON format.
* The server processes the data and returns a response.
* The response is converted to JSON and displayed in the console.


