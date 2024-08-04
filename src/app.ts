import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "routes/api";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

axios.defaults.validateStatus = () => true;

// api 등록
const port = isProduction ? 8080 : 8081;
const app = express();

const corsOptions: cors.CorsOptions = isProduction
  ? {
      origin: "https://example.com",
    }
  : {};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
