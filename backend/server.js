import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import express from "express";
import products from "./data/products.js";
import ProductRouter from "../backend/routes/ProductRoutes.js";
import { errorHandler, notFound } from "../backend/middleware/errorHadnler.js";

const PORT = process.env.PORT || 5000;

connectDb();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", ProductRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("server is running");
});
