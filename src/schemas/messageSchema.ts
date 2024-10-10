import { z } from "zod";

export const MessageSchema = z.object({
  content: z.string().min(10,{message:""}).max(300,""),
});
