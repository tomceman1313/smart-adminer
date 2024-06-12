import { z } from "zod";
import i18next from "i18next";

export const photoSchema = z.object({
	title: z.string().max(60, {
		message: i18next.t("validationErrors:maxLength", { number: 60 }),
	}),
	description: z.string().max(160, {
		message: i18next.t("validationErrors:maxLength", { number: 160 }),
	}),
	image: z.object(),
	id: z.optional(z.string()),
});

export const documentSchema = (t) => {
	return z.object({
		title: z
			.string()
			.min(1, t("validationErrors:required"))
			.max(255, t("validationErrors:maxLength", { number: 255 })),
		description: z.string().max(500, {
			message: t("validationErrors:maxLength", { number: 500 }),
		}),
		category_id: z.string().min(1, t("validationErrors:required")),
		image: z.optional(z.instanceof(FileList)),
		file: z.optional(
			z
				.instanceof(FileList)
				.refine((files) => files?.length > 0, t("validationErrors:required"))
		),
		date: z.string(),
		id: z.optional(z.string()),
	});
};

export const multipleDocumentSchema = (t) => {
	return z.object({
		category_id: z.string().min(1, t("validationErrors:required")),
		files: z
			.instanceof(FileList)
			.refine((files) => files?.length > 0, t("validationErrors:required")),
	});
};

export const notificationSchema = (t) => {
	return z
		.object({
			title: z
				.string()
				.min(1, { message: t("validationErrors:required") })
				.max(60, {
					message: t("validationErrors:maxLength", { number: 60 }),
				}),
			path: z
				.string()
				.min(1, { message: t("validationErrors:required") })
				.refine((val) => !val.includes(" "), {
					message: t("validationErrors:whiteSpaces"),
				}),
			text: z.string().max(120, { message: "" }),
			start: z.string().refine((val) => !isNaN(Date.parse(val)), {
				message: t("validationErrors:required"),
			}),
			end: z.string().refine((val) => !isNaN(Date.parse(val)), {
				message: t("validationErrors:required"),
			}),
			id: z.optional(z.string()),
		})
		.refine((data) => new Date(data.end) >= new Date(data.start), {
			message: t("validationErrors:unrealDates"),
			path: ["end"],
		});
};
