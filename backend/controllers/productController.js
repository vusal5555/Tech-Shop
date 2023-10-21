import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";

//@desc fetch all products
//@route /api/products
//@access Public

const getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
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

//@desc fetch all products
//@route POST /api/products
//@access Private/Admin

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "sample description",
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (product) {
    res.status(200).json({ msg: "product deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(200).json({ msg: "Review added" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

//@desc update product
//@route /api/products
//@access Private/Admin

const editProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.countInStock = req.body.countInStock || product.countInStock;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  return res.status(200).json(products);
});

export {
  getAllProducts,
  getSingProduct,
  createProduct,
  deleteProduct,
  editProduct,
  createReview,
  getTopProducts,
};
