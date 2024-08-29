export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}
export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}
