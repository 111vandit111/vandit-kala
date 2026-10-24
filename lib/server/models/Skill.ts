import mongoose, { Schema, type InferSchemaType } from "mongoose";

const skillSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    detail: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    years: { type: Number, required: true, min: 0 },
    relatedProjects: { type: [String], default: [] },
    image: { type: String, required: true },
    category: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type SkillDoc = InferSchemaType<typeof skillSchema>;

export default mongoose.models.Skill ?? mongoose.model("Skill", skillSchema);
