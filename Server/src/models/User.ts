import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["cliente", "empresa"],
      required: true,
      default: "cliente",
    },
    cliente: { type: Schema.Types.ObjectId, ref: "Cliente" },
    empresa: { type: Schema.Types.ObjectId, ref: "Empresa" },
    firebaseUid: { type: String, required: false, unique: true },
  },
  { timestamps: true }
);

export default model("User", userSchema);
