import { Router } from "express";
import { postNewProduct } from "src/controllers/product";
import { isAuth } from "src/middlesware/auth";
import fileParser from "src/middlesware/fileParser";
import validate from "src/middlesware/validator";
import { newProductSchema } from "src/utils/validationSchema";




const productRouter = Router()

productRouter.post('/postProduct', isAuth, fileParser, validate(newProductSchema), postNewProduct)

export default productRouter
