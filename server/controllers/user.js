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

    // deleteUser: async(req, res)=> {
    //     try{
    //         const user = await User.findById(req.params.id);
    //         res.status(200).json({{user.active ==fasle},"Delete Successfully"});
    //     }catch(error){
    //         res.status(500).json(error); 
    //     }
    // }

    DeactiveUser: async (req, res) => {
        try {
            // Assuming 'id' is passed as a parameter in the request
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    
            if (updatedUser) {
                res.status(200).json({ message: "User deactivated successfully", user: updatedUser });
            } else {
                // User not found
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            // Internal Server Error
            res.status(500).json({ message: "Error deactivating user", error: error.message });
        }
    }


}

module.exports = userController;