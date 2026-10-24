export const CHAT_LIMITS = {
  message: 500,
  historyText: 2000,
  historyTurns: 10,
};

export type ChatRole = "user" | "model";
export type ChatTurn = { role: ChatRole; text: string };
