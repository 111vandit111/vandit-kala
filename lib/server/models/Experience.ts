import mongoose, { Schema, type InferSchemaType } from "mongoose";

const experienceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    summary: { type: String, required: true },
    location: String,
    period: { type: String, required: true },
    bullets: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    impact: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ExperienceDoc = InferSchemaType<typeof experienceSchema>;

export default mongoose.models.Experience ?? mongoose.model("Experience", experienceSchema);
