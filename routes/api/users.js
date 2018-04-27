const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Users = require('../../models/User');

router.get('/', (req, res) => {
  res.send('its working');
});

//POST route to register
router.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  Users.findOne({ email: req.body.email }).then(user => {
    //check to see if user with that email already exists
    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
    } else {
      // create user from model
      const newUser = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.status(200).json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
