// Imports
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as fs from "fs";
import { ICloudinaryResponse, IUploadFile } from "../interfaces/file";
import config from "../config";

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const storage = multer.diskStorage({
  destination: function (req: any, file: any, callback: any) {
    callback(null, "uploads/");
  },
  filename: function (req: any, file: any, callback: any) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Function to upload file to cloudinary
const uploadToCloudinary = async (
  file: IUploadFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const FileUploadHelpers = {
  uploadToCloudinary,
  upload,
};
