import {
  listRecipes,
  recipeById,
  deleteRecipeById,
  createNewRecipe,
} from '../services/recipesServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import responseWrapper from '../decorators/responseWrapper.js';
import {
  listFavorites,
  addFavorite,
  deleteFavorite,
  listPopular,
} from '../services/favoriteServices.js';

const getRecipesByFilter = async (req, res) => {
  const { category, area, ingredients } = req.body;
  const filter = { category, area, ingredients };
  const fields = '';
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit };

  const allRecipes = await listRecipes(filter, fields, settings);
  responseWrapper(allRecipes, 404, res, 200);
};
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  const recipe = await recipeById(id);
  responseWrapper(recipe, 404, res, 200);
};

const getOwnRecipes = async (req, res) => {
  const { _id: owner } = req.user;
  const { category, area, ingredients } = req.body;
  const filter = { category, area, ingredients, owner };
  const fields = '';
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit };

  const allRecipes = await listRecipes(filter, fields, settings);
  responseWrapper(allRecipes, 404, res, 200);
};

const addRecipe = async (req, res) => {
  const { _id: owner } = req.user;
  const {
    title,
    category,
    area,
    instructions,
    description,
    thumb,
    time,
    ingredients,
  } = req.body;

  const recipe = await createNewRecipe({
    title,
    category,
    area,
    instructions,
    description,
    thumb,
    time,
    ingredients,
    owner,
  });
  responseWrapper(recipe, 404, res, 201);
};

const deleteRecipe = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const filter = { _id: id, owner };
  const recipe = await deleteRecipeById(filter);
  responseWrapper(recipe, 404, res, 200);
};

const likeRecipe = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const filter = { recipe: id, user };
  const recipe = await addFavorite(filter);
  responseWrapper(recipe, 404, res, 200);
};

const unlikeRecipe = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const filter = { recipe: id, user };
  const recipe = await deleteFavorite(filter);
  responseWrapper(recipe, 404, res, 200);
};

const getFavoriteRecipes = async (req, res) => {
  const { _id: user } = req.user;
  const filter = { user };
  const fields = '';
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit };
  const allRecipes = await listFavorites(filter, fields, settings);
  responseWrapper(allRecipes, 404, res, 200);
};

const getPopularRecipes = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit };
  const allRecipes = await listPopular(settings);
  responseWrapper(allRecipes, 404, res, 200);
};

export default {
  getRecipesByFilter: ctrlWrapper(getRecipesByFilter),
  getRecipeById: ctrlWrapper(getRecipeById),
  getOwnRecipes: ctrlWrapper(getOwnRecipes),
  addRecipe: ctrlWrapper(addRecipe),
  deleteRecipe: ctrlWrapper(deleteRecipe),
  likeRecipe: ctrlWrapper(likeRecipe),
  unlikeRecipe: ctrlWrapper(unlikeRecipe),
  getFavoriteRecipes: ctrlWrapper(getFavoriteRecipes),
  getPopularRecipes: ctrlWrapper(getPopularRecipes),
};
