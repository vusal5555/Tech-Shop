import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";

//@desc fetch all products
//@route /api/products
//@access Public

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  res.status(200).json(products);
});

//@desc fetch a product
//@route /api/products/:id
//@access Public

const getSingProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

export { getAllProducts, getSingProduct };
