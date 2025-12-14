import { Schema, model, InferSchemaType } from "mongoose";
import Joi from "joi";

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

export type UserType = InferSchemaType<typeof userSchema>;
const UserModel = model<UserType>("User", userSchema);

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  isActive: Joi.boolean().optional(),
  role: Joi.string().valid("cliente", "empresa").required(),
  cliente: Joi.string().optional(),
  empresa: Joi.string().optional(),
  firebaseUid: Joi.string().optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  isActive: Joi.boolean().optional(),
  role: Joi.string().valid("cliente", "empresa").optional(),
  cliente: Joi.string().optional(),
  empresa: Joi.string().optional(),
  firebaseUid: Joi.string().optional(),
});

export default UserModel;
