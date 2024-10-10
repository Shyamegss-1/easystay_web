import { z } from "zod";

export const VerifySchema = z.object({
  identifier: z.string(),
  password: z.string(),
});
