const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const mailjet = require("node-mailjet");

require("dotenv").config();

const mailjetClient = mailjet.connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
  { version: "v3.1" }
);

const sendPasswordResetEmail = async (email, token) => {
  const user = await User.findOne({ email });

  if (!user) {
    console.error("User not found");
    return;
  }

  const request = mailjetClient.post("send").request({
    Messages: [
      {
        From: {
          Email: "kechuyenchobetructuyen@gmail.com",
          Name: "Stories Telling",
        },
        To: [
          {
            Email: user.email,
            Name: `${user.name}`, // You can customize the name if needed
          },
        ],
        // Subject: '[Stories Telling] Reset Password',
        // HTMLPart: `Click on the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
        Subject: "[Stories Telling] Đặt lại mật khẩu của bạn",
        HTMLPart: `
        <p> Chào bạn, </p>
        <br/> 
        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ bạn. Để tiếp tục quá trình này, vui lòng nhấn vào liên kết dưới đây:</p> 
        ${process.env.CLIENT_URL}/reset-password/${token}
        <p>Liên kết này sẽ hết hạn sau một khoảng thời gian ngắn, vì vậy hãy đảm bảo bạn hoàn thành quá trình đặt lại mật khẩu trong thời gian sớm nhất.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này và mật khẩu của bạn sẽ được bảo toàn. </p>
        <p>Hãy lưu ý rằng thông báo này chứa thông tin nhạy cảm, vì vậy đừng chia sẻ liên kết này với bất kỳ ai khác. </p>
        </br>
        <p>Trân trọng,</p> 
        <p>Đội ngũ Stories Telling</p>
      
      `,
      },
    ],
  });

  await request;
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    console.log(token);

    user.resetToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendPasswordResetEmail(email, token);

    res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).send("Email is not valid!");
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Email does not match!");
    }
    if (!user.active) {
      return done(null, false, { message: "Account Lock" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Password does not match!");
    }

    // create jsonwebtoken
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: "3d" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).send("Error:" + error.message);
  }
};

exports.test = async (req, res) => {
  res.send("Checking this components - Test");
};
