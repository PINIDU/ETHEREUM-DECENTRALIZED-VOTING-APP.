const Staff = require('../model/staff');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check , param , body ,validationResult } = require('express-validator');
const router = express.Router();

router.route('/addStaff').post(async (req, res) => {
    try {
      const {
        name,
        email,
        phoneNumber,
        nic,
        bod,
        profile,
        address,
        password,
      } = req.body;
  
      // Check for required fields
      if (!name || !email || !phoneNumber || !nic || !bod || !profile || !address || !password ) {
        console.log('All fields are required');
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('Invalid email address');
        return res.status(400).json({ message: 'Invalid email address' });
      }
  
      // Validate phone number format
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        console.log('Invalid phone number');
        return res.status(400).json({ message: 'Invalid phone number' });
      }
  
      // Validate NIC format
      const nicRegex = /^[0-9]{9}[vVxX]$/;
      if (!nicRegex.test(nic)) {
        console.log('Invalid NIC number');
        return res.status(400).json({ message: 'Invalid NIC number' });
      }
  
      // Validate date of birth (BOD)
      const dob = new Date(bod);
      const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (age < 18 || age > 55) {
        console.log('BOD must be between 18 and 55 years ago');
        return res.status(400).json({ message: 'BOD must be between 18 and 55 years ago' });
      }
  
  
      // Generate salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Save new staff member to database
      const newStaff = new Staff({
        name,
        email,
        phoneNumber,
        nic,
        bod,
        profile,
        address,
        password: hashedPassword,
      });
      await newStaff.save();
  
      // Return success message
      res.status(200).json({ message: 'Staff added successfully' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while adding staff' });
    }
});

router.route('/loginStaff').post(async (req, res) => {
  const { email, password } = req.body;

  try {
    // find the staff member by email
    const staffMember = await Staff.findOne({ email });

    // if the staff member doesn't exist, return an error
    if (!staffMember) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // compare the hashed password with the plain text password provided
    const isPasswordMatch = await bcrypt.compare(password, staffMember.password);

    // if the passwords don't match, return an error
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // if the passwords match, create a token and return it in the response
    const token ={ email : email , status: 'logged' }

    res.json( {token} );
  } catch (err) {
    res.status(500).json({ message: "Error : "+err.message });
  }
});

router.route('/getAllStaff').get((req, res) => {
  Staff.find()
    .then((staff) => {
      if (!staff) {
        return res.status(404).json({ message: 'No staff members found' });
      }
      return res.json(staff);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while retrieving staff members' });
    });
});

router.route('/getStaff/:id')
  .get([
    check('id').isMongoId(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;

    Staff.findById(id)
      .then((staff) => res.json(staff))
      .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/deleteStaff/:id').delete([
  check('id').trim().escape().isMongoId(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid staff member ID' });
    }

    const id = req.params.id;
    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occurred while deleting staff member' });
  }
});

router.route('/updateActivateStatus/:id/:status').put(
  [
    param('id').isMongoId().withMessage('Invalid staff ID'),
    param('status').isBoolean().withMessage('Invalid status value'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const staffID = req.params.id;
      const newStatus = req.params.status;

      const existingStaff = await Staff.findById(staffID);

      if (!existingStaff) {
        return res.status(404).json({ message: 'Staff not found' });
      }

      existingStaff.status = newStatus;

      const updatedStaff = await existingStaff.save();

      res.status(200).json(updatedStaff);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.route('/updateStaff/:id').put(
  [
    param('id').isMongoId(),
    body('name').isLength({ min: 3 }),
    body('phoneNumber').isMobilePhone('en-US'),
    body('profile').isURL(),
    body('address').isLength({ min: 10 })
  ],
  async (req, res) => {
    try {
      const {
        name,
        phoneNumber,
        profile,
        address,
      } = req.body;

      const staff = await Staff.findById(req.params.id);

      if (!staff) {
        return res.status(404).json({ msg: 'Staff not found' });
      }

      staff.name = name || staff.name;
      staff.phoneNumber = phoneNumber || staff.phoneNumber;
      staff.profile = profile || staff.profile;
      staff.address = address || staff.address;

      await staff.save();

      res.status(200).json({ msg: 'Staff updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Error occurred while updating staff' });
    }
  }
);
module.exports = router;