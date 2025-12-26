const visitor = require("../models/visitor.model");

const incrementVisitor = async (req, res) => {
  try {
    // Check if the user already visited today
    if (req.cookies?.visited === "yes") {
      return res.json({
        success: true,
        message: "Already counted for today"
      });
    }

    // First-time visitor for today → Increment count
    let doc = await visitor.findOne();

    if (!doc) {
      doc = await visitor.create({ count: 1 });
    } else {
      doc.count += 1;
      await doc.save();
    }

    // Set cookie for 1 day
    res.cookie("visited", "yes", {
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      count: doc.count,
      message: "Visitor counted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

module.exports = { incrementVisitor };
