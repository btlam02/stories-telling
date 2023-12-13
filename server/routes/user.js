const userController = require("../controllers/user");
const MiddleWareController = require("../middlewares/AuthMiddleware");
const router = require("express").Router();


router.get(
  "/listUser",
  MiddleWareController.verifyToken,
  MiddleWareController.verifyTokenAdminAuth,
  userController.getAllUser
);

router.delete("/delete/:id", userController.deleteUser);
module.exports = router;
