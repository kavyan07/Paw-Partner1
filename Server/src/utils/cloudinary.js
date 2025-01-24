import {v2 as cloudinary} from "cloudinary"
import { unlink } from "node:fs/promises"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            transformation: [
                {width: 1000, crop: "scale"},
                {quality: "auto"},
                {fetch_format: "auto"}
                ]   
        })
        console.log("file is uploaded on cloudinary ", response.url);
        unlink(localFilePath)
        return response.secure_url;

    } catch (error) {
        unlink(localFilePath)
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!imageUrl) return null
        const publicId = imageUrl.split("/").pop().split(".")[0];
        const response = await cloudinary.uploader.destroy(publicId)
        console.log("file is deleted on cloudinary ", response);
        return response;
    } catch (error) {
        console.log("error while deleting file on cloudinary ", error);
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}