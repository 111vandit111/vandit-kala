import mongoose, { Schema, type InferSchemaType } from "mongoose";

const educationSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    period: { type: String, required: true },
    description: String,
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type EducationDoc = InferSchemaType<typeof educationSchema>;

export default mongoose.models.Education ?? mongoose.model("Education", educationSchema);
