import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match: [/.+\@.+\..+/, "Invalid email"]
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["seeker","employer","admin"],
        default:"seeker"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt: { type: Date, default: Date.now },

    // profile fields
  bio: String,
  location: String,
  skills: [String],
  education: String,
  companyName: String,
  website: String,

  // media
  profilePic: String,     // path to image
  resume: String,
  savedJobs: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }
]        
})

const User=mongoose.model("User",userSchema)
 export default User;