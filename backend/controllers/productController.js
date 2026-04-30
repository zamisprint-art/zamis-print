import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        category: 'Sample category',
        countInStock: 0,
        description: 'Sample description',
        requiresTextPersonalization: false,
        requiresImagePersonalization: false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name, price, description, image, gallery, model3D,
        category, subcategory, countInStock,
        requiresTextPersonalization, requiresImagePersonalization, isCustomizable,
        isFeatured, isNewArrival, isOnSale, salePrice,
        material, color, size, measurements, personalizationLevel,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.gallery = gallery || product.gallery;
        product.model3D = model3D || product.model3D;
        product.category = category || product.category;
        product.subcategory = subcategory !== undefined ? subcategory : product.subcategory;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.requiresTextPersonalization = requiresTextPersonalization !== undefined ? requiresTextPersonalization : product.requiresTextPersonalization;
        product.requiresImagePersonalization = requiresImagePersonalization !== undefined ? requiresImagePersonalization : product.requiresImagePersonalization;
        product.isCustomizable = isCustomizable !== undefined ? isCustomizable : product.isCustomizable;
        // Merchandising
        product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
        product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;
        product.isOnSale = isOnSale !== undefined ? isOnSale : product.isOnSale;
        product.salePrice = salePrice !== undefined ? salePrice : product.salePrice;
        // Advanced filters
        product.material = material !== undefined ? material : product.material;
        product.color = color !== undefined ? color : product.color;
        product.size = size !== undefined ? size : product.size;
        product.measurements = measurements !== undefined ? measurements : product.measurements;
        product.personalizationLevel = personalizationLevel !== undefined ? personalizationLevel : product.personalizationLevel;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400).json({ message: 'Product already reviewed' });
            return;
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };
