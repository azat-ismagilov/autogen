import { z } from "zod";

export const configSchema = z.object({
  configPath: z.string(),
	title: z.string(),
  subtitle: z.string(),
  hashtag: z.string(),
  logoPath: z.string(),
  colorTeam: z.string(),
  task: z.string(),
  success: z.boolean(),
  audioPath: z.string(),
	screenVideoPath: z.string(),
	webcamVideoPath: z.string(),
	backgroundVideoPath: z.string(),
});