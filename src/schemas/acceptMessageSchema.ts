import { z } from "zod";

export const acceptMessageSchema = z.object({
  isAceeptingMessages: z.boolean(),
});
