import { connectDb } from "./db";
import { NotFoundError } from "./errors";
import Message from "./models/Message";

export type ContactInput = { name: string; email: string; subject: string; message: string };
export type PageRequest = { page: number; pageSize: number };

export async function saveMessage(input: ContactInput): Promise<void> {
  await connectDb();
  await Message.create({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
  });
}

export async function listMessages({ page, pageSize }: PageRequest) {
  await connectDb();
  const [items, total] = await Promise.all([
    Message.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Message.countDocuments(),
  ]);
  return { items, total };
}

export async function markRead(id: string, isRead: boolean) {
  await connectDb();
  const updated = await Message.findByIdAndUpdate(id, { $set: { isRead } }, { new: true }).lean();
  if (!updated) throw new NotFoundError();
  return updated;
}

export async function deleteMessage(id: string): Promise<void> {
  await connectDb();
  const deleted = await Message.findByIdAndDelete(id).lean();
  if (!deleted) throw new NotFoundError();
}
