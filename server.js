/* Assignment
  Implement delete and update user details
*/
const express = require('express');

const PORT = 501

const app = express();

// middleware -> app.use
app.use(express.json())

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

const users = [
  new User(1, 'Asabe', 'asabe@example.com'),
  new User(2, 'Edosa', 'edosa@example.com'),
  new User(3, 'Uche', 'uche@example.com'),
  new User(4, 'Ebun', 'ebun@example.com'),
  new User(5, 'Nic', 'nic@example.com'),
];

// routes
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Thank you for visiting!',
    query: req.query
  })
})

// CRUD -> create read update delete

app.get('/users', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Here are all the users!',
    data: {
      users: users
    }
  });
});

app.get('/users/:variable', (req, res) => {
  const params = req.params
  const { variable: userId } = req.params

  const user = users.find(user => user.id == userId)
  if (!user) {
    return res.status(404).json({message: 'User not found!'})
  }

  res.status(200).json({
    data: user
  })
});

app.post('/users', (req, res) => {
  const body = req.body

  const { id, name, email } = req.body

  const user = users.find(user => user.id == id)

  if (id == undefined) {
    return res.status(400).json({message: 'id field is mandatory'})
  }
  if (user) {
    return res.status(400).json({message: `User with id ${id} available`})
  }

  const data = { id, name, email }

  users.push(data)

  res.status(201).json({
    message: 'User created successfully',
    data
  })
})

// invalid routes
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: 'Sorry, we do not have anything on this route!',
    data: {
      method: req.method,
      date: new Date().toISOString()
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})