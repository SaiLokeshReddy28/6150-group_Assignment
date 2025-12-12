import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ["mr", "ms", "mrs", "dr", "prof"],
      required: true
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    countryCode: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      min: 18,
      max: 120,
      required: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },

    // 🔹 USER ROLE
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // 🔹 IF USER REQUESTED ADMIN ACCESS
    isAdminRequested: {
      type: Boolean,
      default: false
    },

    // 🔹 WHO APPROVED THIS USER TO BE ADMIN
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // 🔹 ACCOUNT STATUS
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
