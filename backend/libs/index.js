import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

// Function to hash a password
export const hashedPassword = async (userValue) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(userValue, salt);
    return hashed;
};

// Function to compare passwords
export const comparePassword = async (userPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(userPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
};

// Function to create a JWT token
export const createJWT = (id) => {
    return JWT.sign(
        { userId: id },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );
};
