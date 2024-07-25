import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { extractPublicIdFromUrl } from "../utils/extractPublicId.js"


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
            // upload file extension can be detected by cloudinary
            resource_type: "auto"
        })
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        const public_id = await extractPublicIdFromUrl(publicId)
        const response = await cloudinary.uploader.destroy(public_id)
        return response;
    } catch (error) {
        throw new Error("Error while deleting image from Cloudinary")
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }