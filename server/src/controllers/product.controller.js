const Product = require("../models/product.model");
const User = require("../models/user.model");

const createProduct = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      form_data,
      price,
      location,
    } = req.body;

    const images = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }));

    const newProduct = new Product({
      category,
      user: req.user._id,
      title,
      description,
      form_data: JSON.parse(form_data),
      images,
      price,
      location: JSON.parse(location),
    });

    const user = await User.findByIdAndUpdate(req.user._id, { $inc: { products: 1 } });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, err: error.message });
  }
};

// GET PRODUCTS FOR HOME PAGE
// GET ALL PRODUCTS (FILTER, SORT, PAGINATE, SEARCH)
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      priceMin,
      priceMax,
      location,
      sort,
    } = req.query;

    // 1️⃣ Build Query Object
    const query = {};

    // Search (Text search on title & description)
    if (search) {
      query.$text = { $search: search };
    }

    // Category Filter
    if (category) {
      query.category = category;
    }

    // Price Filter
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    // Location Filter (Regex for partial match)
    if (location) {
      query['location.place'] = { $regex: location, $options: 'i' };
    }

    // Dynamic Filters (from form_data)
    // Expecting query params like ?filter_brand=Samsung&filter_fuel=Petrol
    Object.keys(req.query).forEach((key) => {
      if (key.startsWith('filter_')) {
        const fieldName = key.replace('filter_', '');
        if (req.query[key]) {
          // If comma separated (multiple values), use $in
          // Otherwise use regex for flexible matching or exact match
          // Using regex for now for flexibility, or $in if it's an array
          // Let's assume exact match if it looks like a select option, regex if text?
          // Safest for now: regex/partial match for everything to be safe
          query[`form_data.${fieldName}`] = { $regex: req.query[key], $options: 'i' };
        }
      }
    });

    // 2️⃣ Sorting
    let sortOptions = {};
    if (sort === 'price_low') {
      sortOptions.price = 1;
    } else if (sort === 'price_high') {
      sortOptions.price = -1;
    } else if (sort === 'oldest') {
      sortOptions.createdAt = 1;
    } else {
      sortOptions.createdAt = -1; // Default: Newest first
    }

    // 3️⃣ Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // 4️⃣ Execute Query
    const products = await Product.find(query)
      .populate('category', 'title icon')
      .populate('user', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalItems = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        totalItems,
        hasNextPage: pageNum * limitNum < totalItems,
        hasPrevPage: pageNum > 1,
      },
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching products',
      error: error.message,
    });
  }
}

// GET PRODUCT FOR PRODUCT PAGE
const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .populate("user", "full_name email")
      .populate("category", "title");
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching product',
    });
  }
}

// GET LISTED PRODUCTS BY USERS
const getListedProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error
    });
  }
}

// GET PRODUCTS ACCORDING TO CATEGORY
const getProductsForCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;   // FIX 1: Read from params

    const products = await Product
      .find({ category: categoryId })   // FIX 2: add await & correct filter
      .populate("category")             // FIX 3: correct populate key
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });

  } catch (error) {
    console.log("❌ CATEGORY FILTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET RELATED PRODUCTS FOR PRODUCT DETAILS PAGE
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get the current product
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2️⃣ Find related products
    const relatedProducts = await Product.find({
      _id: { $ne: currentProduct._id },            // exclude current product
      category: currentProduct.category,           // same category
    })
      .limit(4)
      .sort({ createdAt: -1 })
      .select("title description price images location");       // send only needed fields

    res.status(200).json({
      success: true,
      data: relatedProducts,
    });

  } catch (error) {
    console.error("❌ Error fetching related products:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching related products",
    });
  }
};



module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  getListedProducts,
  getProductsForCategory,
  getRelatedProducts
}
