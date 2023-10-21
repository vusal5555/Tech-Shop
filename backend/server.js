import path from "path";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import express from "express";

import ProductRouter from "./routes/ProductRoutes.js";
import UserRouter from "./routes/UserRoutes.js";
import OrderRouter from "./routes/OrderRoute.js";
import { errorHandler, notFound } from "../backend/middleware/errorHadnler.js";
import cookieParser from "cookie-parser";
import uploadRoutes from "./routes/uploadRoutes.js";

const PORT = process.env.PORT || 5000;

connectDb();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/products", ProductRouter);
app.use("/api/users", UserRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("hello from server");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("server is running");
});
