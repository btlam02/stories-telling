const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const Schema = mongoose.Schema;

const userSchema = new Schema({

  password: { 
    type: String, 
    required: true
  }, 

  name: 
  {
    type: String,
    default : ""
  },

  email: { 
    type: String, 
    required: true 
  },

  date:
  {
    type: Date,
    default: Date.now
  },
  
  role: {
     type: String, 
     default: 'user' // admin, kid 
  },

  active: { 
    type: Boolean, 
    default: true 
  }
});

userSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next();

  // Tạo salt và hash mật khẩu
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;
