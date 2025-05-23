import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Mount authentication routes
app.use("/api/", router);


// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
