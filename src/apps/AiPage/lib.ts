import axios from "axios";
// import { stdout } from "process";
import { AI_CONFIGS } from "@/config";

export interface Message {
  role: "system" | "user";
  content: string;
}

export async function askQw(messages: Message[]) {
  const res = await axios({
    method: "POST",
    url: AI_CONFIGS.QW.URL,
    responseType: "stream",
    headers: {
      Authorization: `Bearer ${AI_CONFIGS.QW.TOKEN}`,
      "Content-Type": "application/json",
    },
    data: {
      model: "qwen2-1.5b-instruct",
      stream: true,
      messages,
    },
  }).catch((err) => {
    console.log(err);
  });
  if (!res) return;
  return new Promise((resolve) => {
    const stream = res.data;
    stream.on("data", (chunk: any) => {
      const rawData = chunk.toString().replace("data:", "");
      try {
        const data = JSON.parse(rawData);
        // stdout.write(data.choices[0].delta.content);
      } catch (_err) {}
    });
    stream.on("end", () => {
      resolve("ok");
    });
  });
}
