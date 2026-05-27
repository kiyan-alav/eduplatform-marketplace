// import mongoose from "mongoose";
// import { AdminProfile } from "./profiles/admin/admin.model";
// import { User } from "./user.model";
// import { UserRole } from "./user.types";

// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://localhost:27017/edu-platform";

// async function createAdmin() {
//   try {
//     console.log("Connecting to MongoDB...");
//     await mongoose.connect(MONGO_URI);
//     console.log("MongoDB connected");

//     const user = await User.findById("6a172b1862c16e7cfb793a9b");

//     const admin = await AdminProfile.create({
//       user: "6a172b1862c16e7cfb793a9b",
//     });

//     user.adminProfile = admin._id;

//     user.roles.push(UserRole.ADMIN);

//     await user.save();

//     console.log("Admin created successfully:", admin);
//   } catch (error) {
//     console.error("Error creating admin:", error);
//   } finally {
//     await mongoose.disconnect();
//     console.log("MongoDB disconnected");
//   }
// }

// createAdmin();
