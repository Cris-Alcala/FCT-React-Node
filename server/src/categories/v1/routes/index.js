const express = require("express");
const categoriesController = require("../../controllers/categoriesController");

const router = express.Router();

router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategorieById);
router.post("/", categoriesController.addCategorie);
router.patch("/:id", categoriesController.updateCategorie);
router.delete("/:id", categoriesController.deleteCategorie);

module.exports = router;
