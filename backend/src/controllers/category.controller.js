const CategoryModel = require("../models/category.model");
const CategoryNormalizer = require("../normalizers/category.normalizer");

// Категории меняются крайне редко — кешируем на 1 час
const categoriesCache = {
    data: null,
    timestamp: 0,
    TTL: 60 * 60 * 1000 // 1 час
};

class CategoryController {
    static async getCategories(req, res) {
        const now = Date.now();

        if (categoriesCache.data && (now - categoriesCache.timestamp) < categoriesCache.TTL) {
            return res.json(categoriesCache.data);
        }

        let categories = await CategoryModel.find().lean();
        categories = categories.map(item => CategoryNormalizer.normalize(item));

        categoriesCache.data = categories;
        categoriesCache.timestamp = now;

        res.json(categories);
    }
}

module.exports = CategoryController;