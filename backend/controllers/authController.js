import { pool } from "../libs/database.js";
import { hashedPassword, comparePassword, createJWT } from "../libs/index.js";

// Signup user
export const signupUser = async (req, res) => {
    try {
        const { firstname, email, password } = req.body;

        if (!firstname || !email || !password) {
            return res.status(400).json({
                status: "failed",
                message: "Please fill all fields",
            });
        }

        // Check if user already exists
        const userExist = await pool.query({
            text: "SELECT EXISTS (SELECT 1 FROM tbluser WHERE email = $1) AS exists",
            values: [email],
        });

        if (userExist.rows[0].exists) {
            return res.status(409).json({
                status: "failed",
                message: "Email already exists, try again",
            });
        }

        // Hash password
        const hashedPass = await hashedPassword(password);

        // Insert new user into DB
        const newUser = await pool.query({
            text: "INSERT INTO tbluser (firstname, email, password) VALUES ($1, $2, $3) RETURNING id",
            values: [firstname, email, hashedPass],
        });

        const token = createJWT(newUser.rows[0].id);

        res.status(201).json({
            status: "success",
            message: "User created successfully",
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};

// Signin user
export const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide email and password",
            });
        }

        // Get user from DB
        const userResult = await pool.query({
            text: "SELECT * FROM tbluser WHERE email = $1",
            values: [email],
        });

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid email or password",
            });
        }

        const user = userResult.rows[0];

        // Compare password
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid email or password",
            });
        }

        const token = createJWT(user.id);

        const userData= await pool.query({
            text: "SELECT * FROM tbluser WHERE id = $1",
            values: [user.id],
        });

        res.status(200).json({
            status: "success",
            message: "Login successful",
            user: userData.rows[0],
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};
