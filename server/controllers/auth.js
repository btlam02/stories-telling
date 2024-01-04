const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require('validator')

require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!validator.isEmail(email)){
        return res.status(400).send("Email is not valid!");
    }
    const existUser = await User.findOne({email}); 
    if(existUser){
        return res.status(400).send("User is already exist!"); 
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).send("Sign Up Sucessfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
};


exports.signin = async (req, res) => {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send("Email does not match!");
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send("Password does not match!");
      }

      // create jsonwebtoken
      const token = jwt.sign({userId: user._id, role:user.role},process.env.JWT_SECRET_ACCESS, {expiresIn:"3d"});
      res.status(200).json({user,token});
      
    } catch (error) {

      res.status(500).send("Error:" + error.message);
    }
  };



exports.test = async(req, res)=>{
  res.send('Checking this components - Test') 
}