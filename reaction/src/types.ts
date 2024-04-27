import { z } from "zod";

export const configSchema = z.object({
  contestHeader: z.string(),
  title: z.string(),
  subtitle: z.string(),
  hashtag: z.string(),
  logoPath: z.string(),
  colorTeam: z.string(),
  time: z.number(),
  outcome: z.string(),
  task: z.string(),
  success: z.boolean(),
  rankBefore: z.number(),
  rankAfter: z.number(),
  audioPath: z.string(),
  screenVideoPath: z.string(),
  webcamVideoPath: z.string(),
  backgroundVideoPath: z.string(),
});