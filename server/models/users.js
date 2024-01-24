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
  },

  resetToken:{type : String, default: null}, 
  resetPasswordExpires: Date,
});

// userSchema.pre('save', async function(next) {

//   if (!this.isModified('password')) return next();


//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });


// const User = mongoose.model('User', userSchema);

// module.exports = User;

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') && !this.isModified('resetToken')) return next();

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified('resetToken')) {
    // Nếu resetToken thay đổi, bạn có thể thực hiện một số xử lý khác ở đây nếu cần thiết
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;


