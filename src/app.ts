import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "routes/api";
import fileRouter from "routes/file";

// 환경 변수 설정
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

// axios 설정
axios.defaults.validateStatus = () => true;

// app 설정
const app = express();
const port = isProduction ? 8080 : 8081;
const corsOptions: cors.CorsOptions = {};

// CORS 및 라우터 등록
app.use(cors(corsOptions));
app.use("/file", fileRouter);
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
