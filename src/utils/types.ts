import { z } from "zod";

export const CreateCategorySchema = z.object({
	name: z.string().min(3).max(20),
	icon: z.string().max(20),
	type: z.enum(["income", "expense"]),
});
export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;

export const CreateTransactionSchema = z.object({
	amount: z.coerce.number().positive().multipleOf(0.01),
	description: z.string().optional(),
	date: z.coerce.date(),
	category: z.string(),
	type: z.union([z.literal("income"), z.literal("expense")]),
});
export type CreateTransactionSchemaType = z.infer<
	typeof CreateTransactionSchema
>;
