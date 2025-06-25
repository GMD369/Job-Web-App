import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true
  },
  location: String,
  type: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Internship", "Remote"],
    default: "Full-Time"
  },
  description: {
    type: String,
    required: true
  },
  salary: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
  type: String,
  enum: ["Open", "Closed"],
  default: "Open"
},
updatedAt: { type: Date, default: Date.now },

  // ✅ New Field: Applicants Array
  applicants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      appliedAt: {
        type: Date,
        default: Date.now
      }
    },

    
  ]
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
