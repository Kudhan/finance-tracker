import { pool } from "../libs/database";
import { hashedPassword, comparePassword, createJWT } from "../libs/index.js";

export const getUser = async (req, res) => {
    try{
            const {userId} = req.body.user;

            const userExists = await pool.query({
                text: "SELECT * FROM tbluser WHERE id = $1",
                values: [userId],
            });


            const user = userExists.rows[0];
            if(!user){
                return res.status(404).json({ status: "failed", message: "User not found" });
            }

            user.password = undefined;
            res.status(200).json({
                status: "success",
                message: "User fetched successfully",
                user,
            });
    }catch(error){
        console.error(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};

export const updateUser=async (req, res) => {
    try{
        const {userId}=req.body.user;
        const {firstname,lastname,countrt,currency,contact}=req.body;
        const userExists = await pool.query({
            text: "SELECT * FROM tbluser WHERE id = $1",
            values: [userId],
        });

        const user = userExists.rows[0];
        if(!user){
            return res.status(404).json({ status: "failed", message: "User not found" });
        }        

        const updateUser = await pool.query({
            text: "UPDATE tbluser SET firstname = $1, lastname = $2, country = $3, currency = $4, contact = $5 WHERE id = $6",
            values: [firstname, lastname, countrt, currency, contact, userId],
        });

        if(updateUser.rowCount === 0){
            return res.status(400).json({ status: "failed", message: "User not updated" });
        }

        if(updateUser.rowCount > 0){
            const updatedUser = await pool.query({
                text: "SELECT * FROM tbluser WHERE id = $1",
                values: [userId],
            });

            const user = updatedUser.rows[0];
            user.password = undefined;
            res.status(200).json({ status: "success", message: "User updated successfully", user });
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
}

export const changePassword=async (req, res) => {
    try{

        const {userId} = req.body.user;
        const {currentPassword, newPassword,confirmPassword} = req.body;

        const userExists = await pool.query({
            text: "SELECT * FROM tbluser WHERE id = $1",
            values: [userId],
        });

        const user = userExists.rows[0];
        if(!user){
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({ status: "failed", message: "Passwords do not match" });
        }

        const isMatch = await comparePassword(currentPassword, user.password);
        if(!isMatch){
            return res.status(401).json({ status: "failed", message: "Invalid current password" });
        }

        const hashedNewPassword = await hashedPassword(newPassword);
        const updateUser = await pool.query({
            text: "UPDATE tbluser SET password = $1 WHERE id = $2",
            values: [hashedNewPassword, userId],
        });

        if(updateUser.rowCount === 0){
            return res.status(400).json({ status: "failed", message: "User not updated" });
        }

        if(updateUser.rowCount > 0){
            return res.status(200).json({ status: "success", message: "User updated successfully" });
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
}
