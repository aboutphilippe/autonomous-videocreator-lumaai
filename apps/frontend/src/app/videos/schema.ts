import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  key: z.string(),
  source: z.string(),
  title: z.string(),
  body: z.string(),
  url: z.string().nullable(),
  createdAt: z.date(),
  // author: z.object({
  //   id: z.string(),
  //   type: z.string(),
  //   typeId: z.string(),
  //   imageUrl: z.string().nullable(),
  //   handle: z.string(),
  //   url: z.string().nullable(),
  // }),
  status: z.string().nullable(),
  // labels: z.array(
  //   z.object({
  //     id: z.string(),
  //     sourceReferenceId: z.string(),
  //     sourceId: z.string(),
  //     name: z.string(),
  //     description: z.string().nullable(),
  //     createdAt: z.date(),
  //     color: z.string().nullable(),
  //   })
  // ),
  // summary: z.string().optional(),
  priority: z.string().optional(),
});

export type Message = z.infer<typeof messageSchema>;
