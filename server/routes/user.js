const userController = require("../controllers/user");
const MiddleWareController = require("../middlewares/AuthMiddleware");
const router = require("express").Router();


router.get(
  "/list-user",
  //MiddleWareController.verifyToken,
  //MiddleWareController.verifyTokenAdminAuth,
  userController.getAllUser
);

router.post('/create-user', userController.createUser);
router.put('/update-user/:id', userController.updateUser);
router.put('/deactive-user/:id', userController.DeactiveUser);
router.put('/active-user/:id', userController.ActiveUser);
router.get('/users/:id', userController.GetUserById);


module.exports = router;
