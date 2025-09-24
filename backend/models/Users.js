import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate emails
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // restrict roles
      default: "user",
    },
  },
  {
    timestamps: true, //  automatically adds createdAt & updatedAt
  }
);

userSchema.pre("save", async function (next) {
  if (!this.userId) {
    const count = await mongoose.model("User").countDocuments();
    this.userId = `USR${(count + 1).toString().padStart(3, "0")}`;
  }
  next();
});
const User = mongoose.model("User", userSchema);

export default User