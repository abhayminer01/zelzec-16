const { incrementVisitor } = require("../controllers/visitor.controller");

const router = require("express").Router();

router.get("/increment", incrementVisitor);

module.exports = router;
