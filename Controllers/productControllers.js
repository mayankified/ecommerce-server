const express = require("express");
const router = express.Router();

// productController.js

const Product = require("../models/product.js");
// const upload = require("../middlewares/upload.js");

const mongoose = require('mongoose');



exports.getProducts = async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    try {
        const productList = await Product.find(filter).populate('category');
        res.status(200).json(productList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            images: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            price: req.body.discount,
            rating: req.body.rating,
            category: req.body.category,
            countInStock: req.body.countInStock,  
            isFeatured: req.body.isFeatured,
        });

        product = await product.save();

        if (!product) {
            res.status(500).send('Product cannot be created');
        } else {
            res.status(201).json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            res.status(400).send('Invalid Category');
            return;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            {
                new: true,
            }
        );

        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        if (product) {
            res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getProductCount = async (req, res) => {
    try {
        const productCount = await Product.countDocuments({});
        res.status(200).json({ productCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getFeaturedProducts = async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const products = await Product.find({ isFeatured: true }).limit(+count);
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.updateGalleryImages = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product ID');
        return;
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.fileName}`);
        });
    }

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                image: imagesPaths,
            },
            {
                new: true,
            }
        );

        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
