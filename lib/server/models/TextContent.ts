import mongoose, { Schema, type InferSchemaType } from "mongoose";

const textContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, default: "" },
  },
  { timestamps: true }
);

export type TextContentDoc = InferSchemaType<typeof textContentSchema>;

export default mongoose.models.TextContent ?? mongoose.model("TextContent", textContentSchema);
