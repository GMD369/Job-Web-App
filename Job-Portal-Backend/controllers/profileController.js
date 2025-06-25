import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

// PUT /api/profile/me
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const data = req.body;

    // Handle file removals
    if (data.removeProfilePic === "true") {
      user.profilePic = null;
    }

    if (data.removeResume === "true") {
      user.resume = null;
    }

    // Handle profilePic upload
    if (req.files?.profilePic) {
      const file = req.files.profilePic[0];
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "profile_pics",
      });
      user.profilePic = result.secure_url;
    }

    // ✅ Handle resume upload to Cloudinary as raw file
    if (req.files?.resume) {
      const file = req.files.resume[0];
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw",      // for PDF and other non-image files
        folder: "resumes",
        access_mode: "public",     // 👈 make it publicly accessible
        use_filename: true,
        unique_filename: false,
      });
      user.resume = result.secure_url;
    }

    // Update other fields
    const updatableFields = ["bio", "location", "skills", "education", "companyName", "website", "name"];
    updatableFields.forEach((field) => {
      if (data[field] !== undefined) user[field] = data[field];
    });

    await user.save();
    res.status(200).json({ message: "Profile updated", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};



export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const getUserWithProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user and exclude password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return full user detail
    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        bio: user.bio || "",
        location: user.location || "",
        skills: user.skills || [],
        education: user.education || "",
        companyName: user.companyName || "",
        website: user.website || "",
        profilePic: user.profilePic || null,
        resume: user.resume || null,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error("❌ getUserWithProfile error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
