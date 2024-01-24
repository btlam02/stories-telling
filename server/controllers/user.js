const User = require("../models/users");
const crypto = require("crypto");

const userController = {
  createUser: async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getAllUser: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  DeactiveUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
      );

      if (updatedUser) {
        res.status(200).json({
          message: "User deactivated successfully",
          user: updatedUser,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deactivating user", error: error.message });
    }
  },


  GetUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  ActiveUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { active: true },
        { new: true }
      );

      if (updatedUser) {
        res.status(200).json({
          message: "User deactivated successfully",
          user: updatedUser,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deactivating user", error: error.message });
    }
  },

  updateUser: async (req, res) => {
    const updates = Object.keys(req.body);
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      updates.forEach((update) => (user[update] = req.body[update]));
      await user.save();
      res.send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = userController;
