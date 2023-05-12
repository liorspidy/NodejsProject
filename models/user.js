const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birthday: { type: Date, required: true },
});

const User = mongoose.model('User', userSchema);

// Create a demo user
const newUser = new User({
  id: 123123,
  first_name: 'moshe',
  last_name: 'israeli',
  birthday: new Date('1990-01-10'),
});

// Check if the user exists in the database
User.findOne({ id: newUser.id })
  .then((user) => {
    if (!user) {
      newUser
        .save()
        .then()
        .catch((err) => console.error(err));
    }
  })
  .catch((err) => console.error(err));

module.exports = User;
