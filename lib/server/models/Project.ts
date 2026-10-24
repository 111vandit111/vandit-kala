import mongoose, { Schema, type InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    problem: { type: String, required: true },
    role: { type: String, required: true },
    approach: { type: String, required: true },
    impact: { type: String, required: true },
    tags: { type: [String], default: [] },
    repoUrl: String,
    liveUrl: String,
    year: String,
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ProjectDoc = InferSchemaType<typeof projectSchema>;

export default mongoose.models.Project ?? mongoose.model("Project", projectSchema);
