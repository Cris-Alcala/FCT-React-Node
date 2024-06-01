const categoriesService = require("../services/categoriesService");

const getAllCategories = async (req, res) => {
  const { name } = req.query;
  try {
    res.status(200).json(categoriesService.getAllCategories({ name }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategorieById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Categorie ID is required" });
    }
    res.status(200).json(categoriesService.getCategorieById(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCategorie = async (req, res) => {
  try {
    const categorie = req.body;
    if (!categorie) {
      return res.status(400).json({ error: "Categorie data is required" });
    }
    res.status(201).json(await categoriesService.addCategorie(categorie));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const categorie = req.body;
    if (!id) {
      return res.status(400).json({ error: "Categorie ID is required" });
    }
    if (!categorie) {
      return res.status(400).json({ error: "Categorie data is required" });
    }
    res.status(200).json(await categoriesService.updateCategorie(id, categorie));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Categorie ID is required" });
    }
    res.status(200).json(categoriesService.deleteCategorie(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategorieById,
  addCategorie,
  updateCategorie,
  deleteCategorie,
};
