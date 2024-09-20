import { UploadApiResponse } from "cloudinary";
import { RequestHandler } from "express";
import { request } from "http";
import { isValidObjectId } from "mongoose";
import cloudUploader, { cloudApi } from "src/cloud";
import ProductModel from "src/models/product";
import { UserDocument } from "src/models/users";
import { sendErrorRes } from "src/utils/helper";
import formidable from "formidable";




const uploadImage = async (filePath: string): Promise<UploadApiResponse> => {
        const response = await cloudUploader.upload(filePath, {
            width: 1200,
            height: 720,
            crop: 'fill'
        });
        return response;
  }

export const postNewProduct: RequestHandler = async (req , res ) => {
    // User must be authenticated
    // User can upload images as well
    // Validate incoming data
    // Create Product
    // Validate and upload file (or files) - note (restrict image qty)
    // And send the response back
    const {name, price, category, description, purchaseDate} = req.body
    const newProduct  = new ProductModel({
        owner: req.user.id,
        name,
        price,
        category, 
        description, 
        purchaseDate,
    })
    const {images} = req.files
    const isMultipleImages = Array.isArray(images)
    if(isMultipleImages && images.length > 5) {
        return sendErrorRes(res, "Please images should not exceed limit of 5", 422);
    }
    let invalidFileType = false;
    // if this is the case, we have multiple images
    if(isMultipleImages){
        for(let img of images){
            if(!img.mimetype?.startsWith('image')){
                invalidFileType = true;
                break;
            }
    } 
}   
    else {
        if(images){
            if(!images.mimetype?.startsWith('image')){
                invalidFileType = true;
                
            }
        }
    }
    if(invalidFileType)
        return sendErrorRes(res, "Invalid file type, file must be image type", 422);
    //FILE UPLOAD
    if(isMultipleImages){
       const uploadPromise =  images.map((file) => uploadImage(file.filepath));
       // wait for all uploads to complete
       const uploadResults = await Promise.all(uploadPromise);
       console.log(uploadResults);
       // Add the image URLs and pubic ids to the product's images
       newProduct.images = uploadResults.map(({secure_url, public_id}) =>{
        return {url:secure_url, id: public_id} 
       })
       newProduct.thumbnail = newProduct.images[0].url
    } else {
        if(images){
            const {secure_url, public_id} = await uploadImage( images.filepath);
            newProduct.images = [{url: secure_url, id: public_id}]
            newProduct.thumbnail = secure_url
        }
    }
    await newProduct.save();
    res.status(201).json({message: "New product added"})
   
};

export const updateProduct: RequestHandler = async (req , res ) => {
    
    // User must be authenticated
    // User can upload images as well
    // Validate incoming data
    // Update normal properties (if the product is being updated by the same user)
    // upload and update images (restrict image quantity)
    // Send response back


   const {name, price, category, description, purchaseDate, thumbnail} = req.body;
   const productID = req.params.id;
   
   if(!isValidObjectId(productID)) 
   return sendErrorRes(res, "Invalid product Id!", 422)

   const product = await ProductModel.findOneAndUpdate(
    {_id: productID, owner: req.user.id}, 
    {
    name, 
    price, 
    category, 
    description, 
    purchaseDate,
    thumbnail,
    
   },
   {
    new: true,
    }
);

    
//    const {images} = req.files

//    const isMultipleImages = Array.isArray(images)
   
   if(!product) return sendErrorRes(res, "Product not found!", 404)

   if(typeof thumbnail === "string") product.thumbnail = thumbnail

   const {images} = req.files
   const isMultipleImages = Array.isArray(images)

    if(isMultipleImages){
        const oldImages = product.images?.length || 0
        if( oldImages + images.length >  5)
            return sendErrorRes(res, "Please images exceeds limit of 5", 422);
    
    }


    let invalidFileType = false;

    // if this is the case, we have multiple images
    if(isMultipleImages){
        for(let img of images){
            if(!img.mimetype?.startsWith('image')){
                invalidFileType = true;
                break;
            }
    } 
}   
    else{
        if(images){
            if(!images.mimetype?.startsWith('image')){
                invalidFileType = true;
                
            }
        }
    }
    if(invalidFileType)
        return sendErrorRes(res, "Invalid file type, file must be image type", 422);

    //FILE UPLOAD

    if(isMultipleImages){
       const uploadPromise =  images.map((file) => uploadImage(file.filepath));

       // wait for all uploads to complete
       const uploadResults = await Promise.all(uploadPromise);
       console.log(uploadResults);
        
       // Add the image URLs and pubic ids to the product's images
        const newImages = uploadResults.map(({secure_url, public_id}) =>{
        return {url:secure_url, id: public_id}
        
       });

        if(product.images) product.images.push(...newImages);
        else product.images = newImages;

    } else {
        if(images){
            const {secure_url, public_id} = await uploadImage(images.filepath);

            if(product.images)
            product.images.push({url: secure_url, id: public_id});
            else product.images = [{url: secure_url, id: public_id}]
        }
    }
    
    await product.save()
    res.status(201).json({message: "Product Updated successfully"})
   
};

export const deleteProduct: RequestHandler = async (req , res ) => {
    
    // User must be authenticated
    // Validate the product ID
    // REmove  if its made by the same user
    // Remove image as well
    // Send response back

   const productID = req.params.id;
   if(!isValidObjectId(productID)) 
   return sendErrorRes(res, "Invalid product Id!", 422)

   const product = await ProductModel.findOneAndDelete(
    {_id: productID, 
    owner: req.user.id})

    if(!product){
        return sendErrorRes(res, "Product not found or not made by you!", 404)
    }

    const images = product.images || []
    if(images.length){
       const ids = images.map(({id}) => id);
        await cloudApi.delete_resources(ids)
    }

    res.status(201).json({message: "Product deleted successfully"})
   
};


export const deleteProductImage: RequestHandler = async (req , res ) => {
    // User must be authenticated
    // Validate the product ID
    // Remove image frm DB, if it is request is made by the user
    // Remove from cloud as well
    // Send response back
   const {productId, imageId} = req.params;
   if(!isValidObjectId(productId)) 
   return sendErrorRes(res, "Invalid product Id!", 422)
   const product = await ProductModel.findOneAndUpdate(
    {_id: productId, 
      owner: req.user.id}, {
    $pull:{
        images: {id: imageId}
    }
   },
   {new: true}
);
if(!product)return sendErrorRes(res, "Product not found", 404)
   if(product.thumbnail?.includes(imageId)){
    const images = product.images
   if(images)product.thumbnail = images[0].url;
   else product.thumbnail = "";
   await product.save();
   }
    // Removing image from cloud storage
    await cloudUploader.destroy(imageId);
    res.json({message: "Images removed successfully"})

};


export const getProductDetails: RequestHandler = async (req , res ) => {
    // User must be authenticated (Optional)
    // Validate the product ID
    // find product by id
    // Format data
    // Send response back
   const {id} = req.params;
   if(!isValidObjectId(id)) 
   return sendErrorRes(res, "Invalid product Id!", 422)
   const product = await ProductModel.findById(id).populate<{owner: UserDocument}>("owner");
   if(!product) return sendErrorRes(res, "Product not found!", 422)


   res.json({product: {
    id: product._id,
    name: product.name,
    description: product.description,
    thumbnail: product.thumbnail,
    date: product.purchaseDate,
    price: product.price,
    images: product.images?.map(({url}) => url),
    seller: {
        id: product.owner._id,
        name: product.owner.name,
        avatar: product.owner.avatar?.url
    }
   }});
}


export const getProductByCategory: RequestHandler = async (req , res ) => {
    // User must be authenticated (Optional)
    // Validate the category
    // find product by category {apply pagination if necessary}
    // Format data
    // Send response back
   
    const {category } = req.params;
    const {pageNo="1", limit="10"} = req.query as {pageNo: string, limit:string}
    if(!category.includes(category)) 
        return sendErrorRes(res, "invalid category", 422);

    const products = await ProductModel.find({category})
    .sort("-createdAt")
    .skip((+pageNo - 1) * +limit)
    .limit(+limit)
    const listings = products.map(p => {
            return {
            id: p._id,
            name: p.name,
            thumbnail: p.thumbnail,
            category: p.category,
            price: p.price,
        } ;
    });
        res.json({products: listings});
}


export const getLatestProducts: RequestHandler = async (req , res ) => {
    // User must be authenticated (Optional)
    // find All products with sorted date, {apply limit/pagination if necessary}
    // Format data
    // Send response back

    const products = await ProductModel.find()
    .sort("-createdAt")
    .limit(10)
    const listings = products.map(p => {
        return {
        id: p._id,
        name: p.name,
        thumbnail: p.thumbnail,
        category: p.category,
        price: p.price,
    } ;
});
        res.json({products: listings});
}


export const getListings: RequestHandler = async (req , res ) => {
    // User must be authenticated (Optional)
    // find all products created by this user {apply pagination if necessary}
    // Format data
    // Send response back
    const {pageNo="1", limit="10"} = req.query as 
    {pageNo: string, 
    limit:string}

    const products = await ProductModel.find({owner: req.user.id})
    .sort("-createdAt")
    .skip((+pageNo - 1) * +limit)
    .limit(+limit)
    const listings = products.map(p => {
            return {
            id: p._id,
            name: p.name,
            thumbnail: p.thumbnail,
            category: p.category,
            price: p.price,
            images: p.images?.map( img => img.url),
            date: p.purchaseDate,
            description: p.description,
            seller: {
              id:  req.user.id,
              name: req.user.name,
              avatar: req.user.avatar
            }
        } ;
    });
        res.json({products: listings});
}