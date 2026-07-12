const router = require('express').Router();
const { v4 } = require('uuid')

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

const users = [
  {
    "id": "16f5b131-8fe8-4638-8d96-1aa53501625d",
    "name": "Asabe",
    "email": "asabe@example.com"
  },
  {
    "id": "9a59b83e-c76e-4c76-a88b-70c91df36627",
    "name": "Edosa",
    "email": "edosa@example.com"
  },
  {
    "id": "53a381b7-7b0f-4969-bb5f-f3c6add2c5df",
    "name": "Uche",
    "email": "uche@example.com"
  },
  {
    "id": "40f2cb37-a452-4185-9b9f-84d61b33bf82",
    "name": "Ebun",
    "email": "ebun@example.com"
  },
  {
    "id": "f4b64879-4c8f-4554-adc2-adcbb97d01d3",
    "name": "Nic",
    "email": "nic@example.com"
  },
  {
    id: v4(),
    name: 'Random Name',
    email: 'UcHe@eXaMpLe.com'
  }
];



router.get('', (req, res) => {
  const { email } = req.query
  let filteredUsers = users
  if (email) {
    filteredUsers = users.filter(user => user.email.toLowerCase() == email?.toLowerCase())
  }
  res.status(200).json({
    status: true,
    message: 'Here are all the users!',
    data: {
      users: filteredUsers
    }
  });
});
 
const { email, name, sort } = req.query;

//Sorting
if (sort === "name") {
    filteredUsers.sort((a, b) =>
        a.name.localeCompare(b.name)
    );
}

if (sort === "email") {
    filteredUsers.sort((a, b) =>
        a.email.localeCompare(b.email)
    );
}
//Validation for email and name query parameters
router.get('/:id', (req, res) => {

    const { id } = req.params;

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found."
        });
    }

    res.status(200).json(user);

});

router.get('/:variable', (req, res) => {
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


router.post('', (req, res) => {
  const body = req.body

  const { name, email } = req.body

  const user = users.find(user => user.email == email)

  if (user) {
    return res.status(400).json({message: `User with email: ${email} exists`})
  }

  const data = { id: v4(), name, email }

  users.push(data)

  res.status(201).json({
    message: 'User created successfully',
    data
  })
})

module.exports = router