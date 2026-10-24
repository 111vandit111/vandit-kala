import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { TRACKED_PROFILE_TYPES } from "../limits";

const dailyVisitSchema = new Schema(
  {
    type: { type: String, enum: TRACKED_PROFILE_TYPES, required: true },
    day: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

dailyVisitSchema.index({ type: 1, day: 1 }, { unique: true });

export type DailyVisitDoc = InferSchemaType<typeof dailyVisitSchema>;

export default mongoose.models.DailyVisit ?? mongoose.model("DailyVisit", dailyVisitSchema);
