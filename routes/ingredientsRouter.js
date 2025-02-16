import express from 'express';
import { getAllIngredients } from '../controllers/ingredientsController.js';

const ingredientsRouter = express.Router();

ingredientsRouter.get(
  '/',
  getAllIngredients
  // #swagger.tags = ['Ingredients']
  /* #swagger.responses[200] = {
            description: "OK",
            schema: { $ref: '#/components/schemas/ingredientsResponse' }
        }   
    */
  /* #swagger.responses[404] = {
            description: "Bad request",
            schema: { $ref: '#/components/schemas/errorMessage' }
        }   
    */
);

export default ingredientsRouter;
