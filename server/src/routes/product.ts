import { Router } from "express";
import {
    deleteProduct,
    deleteProductImage,
    getLatestProducts,
    getListings,
    getProductByCategory,
    getProductDetails,
    postNewProduct,
    updateProduct,
} from "src/controllers/product";
import { isAuth } from "src/middlesware/auth";
import fileParser from "src/middlesware/fileParser";
import validate from "src/middlesware/validator";
import { newProductSchema } from "src/utils/validationSchema";

const productRouter = Router();

productRouter.post(
    '/postProduct', 
    isAuth, 
    fileParser, 
    validate(newProductSchema), 
    postNewProduct
);

productRouter.patch(
    '/:id', 
    isAuth, 
    fileParser, 
    validate(newProductSchema), 
    updateProduct
);

productRouter.delete('/:id', isAuth, deleteProduct);

productRouter.delete(
    '/image/:productId/:imageId', 
    isAuth, 
    deleteProductImage
);

productRouter.get('/detail/:id', isAuth, getProductDetails);

productRouter.get('/latest', getLatestProducts);

productRouter.get('/listings', isAuth, getListings);

export default productRouter;
