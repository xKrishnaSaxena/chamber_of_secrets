require("dotenv").config();

import express from "express";
import userRouter from "./routes/userRoutes";
import contentRouter from "./routes/contentRoutes";
import tagRouter from "./routes/tagRoutes";
import linkRouter from "./routes/linkRoutes";
import cors from "cors";
const PORT = process.env.PORT;
const app = express();
const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/brain", linkRouter);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
