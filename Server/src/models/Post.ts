import { Schema, model, InferSchemaType, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // referencia a User
  },
  { timestamps: true }
);

export type PostType = InferSchemaType<typeof postSchema>;

const Post = model<PostType>("Post", postSchema);

export default Post;
