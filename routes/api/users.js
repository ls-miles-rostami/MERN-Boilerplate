const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const Users = require('../../models/User');
const keys = require('../../config/keys');



//Test route to see who is the current user
router.get('/current',passport.authenticate('jwt', {session: false}) ,(req,res) => {
  res.json({id: req.user.id, name: req.user.name, email: req.user.email})
})


//POST login route
router.post('/login', (req,res) => {
  const email = req.body.email
  const password = req.body.password

  Users.findOne({email}).then(user => {
    if(!user){
      return res.status(404).json({error: 'User not found'});
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if(isMatch) {
        const payload = {
          id: user.id,
          name: user.name
        }
        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
          res.json({sucess: true, token: 'Bearer ' + token})
        })
      } else{ 
        return res.status(400).json(errors)
      }
    })
  })

})




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
