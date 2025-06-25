// middleware/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "jobportal_uploads";
    if (file.fieldname === "profilePic") folder = "profile_pics";
    if (file.fieldname === "resume") folder = "resumes";

    return {
      folder,
      resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF/Image files allowed"), false);
};

const upload = multer({ storage, fileFilter });
export default upload;
