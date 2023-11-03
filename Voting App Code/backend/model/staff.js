const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\+?\d{10,14}$/,
  },
  nic: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{9}[vVxX]$/,
  },
  bod: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        const now = new Date();
        const age = now.getFullYear() - value.getFullYear();
        return age >= 18 && age <= 55;
      },
      message: 'Age must be between 18 and 55',
    },
  },
  profile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 1,
  },
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
