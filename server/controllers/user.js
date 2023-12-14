const User = require("../models/users");

const userController ={
    getAllUser: async(req, res)=>{
        try{
            const user = await User.find(); 
            res.status(200).json(user); 
        }catch(error){
            res.status(500).json(error); 
        }
    },


    DeactiveUser: async (req, res) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    
            if (updatedUser) {
                res.status(200).json({ message: "User deactivated successfully", user: updatedUser });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deactivating user", error: error.message });
        }
    }


}

module.exports = userController;