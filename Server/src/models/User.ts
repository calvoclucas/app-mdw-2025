import { Schema, model, InferSchemaType, Types } from "mongoose";

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
    cliente: { type: Types.ObjectId, ref: "Cliente" },
    empresa: { type: Types.ObjectId, ref: "Empresa" },
    firebaseUid: {
      type: String,
      required: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export type UserType = InferSchemaType<typeof userSchema>;
export default model<UserType>("User", userSchema);
