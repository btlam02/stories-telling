const userController = require("../controllers/user");
const MiddleWareController = require("../middlewares/AuthMiddleware");
const router = require("express").Router();


router.get(
  "/listUser",
  //MiddleWareController.verifyToken,
  //MiddleWareController.verifyTokenAdminAuth,
  userController.getAllUser
);


router.put("/deactive/:id",userController.DeactiveUser);

module.exports = router;
