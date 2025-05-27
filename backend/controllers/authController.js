import { pool } from "../libs/database.js";
import { hashedPassword, comparePassword, createJWT } from "../libs/index.js";

// Signup user
export const signupUser = async (req, res) => {
  try {
    const { firstname, email, password, provider, uid } = req.body;

    // firstname and email are always required
    if (!firstname || !email) {
      return res.status(400).json({
        status: "failed",
        message: "Please fill all required fields (firstname, email)",
      });
    }

    // For social signup, provider and uid are required
    if (provider) {
      if (!uid) {
        return res.status(400).json({
          status: "failed",
          message: "UID is required for social signup",
        });
      }
      // No password needed for social signup
    } else {
      // For email/password signup, password is required
      if (!password) {
        return res.status(400).json({
          status: "failed",
          message: "Password is required for email signup",
        });
      }
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

    // Hash password if provided, else null
    let hashedPass = null;
    if (password) {
      hashedPass = await hashedPassword(password);
    }

    // Insert new user with optional provider and uid
    const newUser = await pool.query({
      text: `INSERT INTO tbluser (firstname, email, password, provider, uid) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      values: [firstname, email, hashedPass, provider || null, uid || null],
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

    // ❗ Check if user has a password (i.e., not a social login user)
    if (!user.password) {
      return res.status(400).json({
        status: "failed",
        message: "This account was created with social login. Please sign in with Google.",
      });
    }

    // ✅ Now safely compare password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const token = createJWT(user.id);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    console.error("Error in signinUser:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
