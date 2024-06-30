import { z } from "zod";
import i18next from "i18next";

const phoneRegex = new RegExp(
	/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const photoSchema = (t) => {
	return z.object({
		title: z.optional(
			z.string().max(60, {
				message: t("validationErrors:maxLength", { number: 60 }),
			})
		),
		description: z.optional(
			z.string().max(160, {
				message: t("validationErrors:maxLength", { number: 160 }),
			})
		),
		image: z.optional(z.instanceof(FileList)),
		id: z.optional(z.string()),
	});
};

export const multiplePhotoSchema = (t) => {
	return z.object({
		images: z
			.instanceof(FileList)
			.refine((files) => files?.length > 0, t("validationErrors:required")),
	});
};

export const vacancySchema = (t) => {
	return z
		.object({
			title: z
				.string()
				.min(1, t("validationErrors:required"))
				.max(60, {
					message: i18next.t("validationErrors:maxLength", { number: 60 }),
				}),
			description: z.string().max(160, {
				message: i18next.t("validationErrors:maxLength", { number: 160 }),
			}),
			image: z.optional(z.instanceof(FileList)),
			date: z.string().refine((val) => !isNaN(Date.parse(val)), {
				message: t("validationErrors:required"),
			}),
			active: z.boolean(),
			id: z.optional(z.string()),
		})
		.refine((data) => (data?.id ? true : data.image.length > 0), {
			message: t("validationErrors:required"),
			path: ["image"],
		});
};

export const pageSchema = (t) => {
	return z.object({
		title: z
			.string()
			.min(1, t("validationErrors:required"))
			.max(80, {
				message: i18next.t("validationErrors:maxLength", { number: 80 }),
			}),
		description: z
			.string()
			.min(1, t("validationErrors:required"))
			.max(250, {
				message: i18next.t("validationErrors:maxLength", { number: 250 }),
			}),
		image: z.optional(z.instanceof(FileList)),
		body: z.optional(z.string()),
	});
};

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

export const priceListItemSchema = (t) => {
	return z
		.object({
			name: z
				.string()
				.min(1, { message: t("validationErrors:required") })
				.max(60, {
					message: t("validationErrors:maxLength", { number: 60 }),
				}),
			price: z
				.string()
				.min(1, t("validationErrors:required"))
				.refine((val) => Number(val), t("validationErrors:acceptOnlyNumeric")),
			special_price: z.string(),
			start: z.string(),
			end: z.string(),
			id: z.optional(z.number()),
		})
		.refine(
			(data) => {
				if (data.special_price.length === 0) return true;

				return !isNaN(Date.parse(data.start));
			},
			{
				message: t("validationErrors:required"),
				path: ["start"],
			}
		)
		.refine(
			(data) => {
				if (data.special_price.length === 0) return true;

				return !isNaN(Date.parse(data.end));
			},
			{
				message: t("validationErrors:required"),
				path: ["end"],
			}
		)
		.refine(
			(data) => {
				if (data.special_price.length === 0) return true;

				return new Date(data.end) >= new Date(data.start);
			},
			{
				message: t("validationErrors:unrealDates"),
				path: ["end"],
			}
		);
};

export const articleSchema = (t) => {
	return z.object({
		title: z
			.string()
			.min(1, t("validationErrors:required"))
			.max(60, {
				message: t("validationErrors:maxLength", { number: 60 }),
			}),
		description: z.string().max(160, {
			message: t("validationErrors:maxLength", { number: 160 }),
		}),
		image: z.optional(
			z
				.instanceof(FileList)
				.refine((image) => image?.length > 0, t("validationErrors:required"))
		),
		images: z.optional(z.instanceof(FileList)),
		category_id: z.string().min(1, t("validationErrors:required")),
		date: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: t("validationErrors:required"),
		}),
		active: z.boolean(),
		id: z.optional(z.string()),
	});
};

export const productSchema = (t) => {
	return z.object({
		name: z
			.string()
			.min(1, t("validationErrors:required"))
			.max(255, {
				message: t("validationErrors:maxLength", { number: 255 }),
			}),
		description: z.string().max(500, {
			message: t("validationErrors:maxLength", { number: 500 }),
		}),
		images: z.optional(z.instanceof(FileList)),
		manufacturer_id: z.string().min(1, t("validationErrors:required")),
		active: z.boolean(),
		id: z.optional(z.string()),
	});
};

export const orderSchema = (t) => {
	return z.object({
		status_code: z.string().min(1, t("validationErrors:required")),
		payment_method: z.string().min(1, t("validationErrors:required")),
		shipping_type_id: z.string().min(1, t("validationErrors:required")),
		order_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: t("validationErrors:required"),
		}),
		shipped_date: z.string(),
		completed_date: z.string(),
		comments: z.string(),

		fname: z.string().min(1, t("validationErrors:required")),
		lname: z.string().min(1, t("validationErrors:required")),
		phone: z
			.string()
			.min(9, t("validationErrors:required"))
			.regex(phoneRegex, t("validationErrors:invalidPhoneNumber")),
		email: z.string().email().min(1, t("validationErrors:required")),
		address: z.string().min(1, t("validationErrors:required")),
		city: z.string().min(1, t("validationErrors:required")),
		postal_code: z.string().min(1, t("validationErrors:required")),

		delivery_fname: z.optional(z.string()),
		delivery_lname: z.optional(z.string()),
		delivery_address: z.optional(z.string()),
		delivery_city: z.optional(z.string()),
		delivery_postal_code: z.optional(z.string()),

		company_name: z.optional(z.string()),
		ic: z.optional(z.string()),
		dic: z.optional(z.string()),
	});
};

export const userSchema = (t) => {
	return z.object({
		username: z
			.string()
			.min(1, t("validationErrors:required"))
			.max(60, {
				message: t("validationErrors:maxLength", { number: 60 }),
			}),
		fname: z
			.string()
			.min(1, t("validationErrors:required"))
			.max(60, {
				message: t("validationErrors:maxLength", { number: 60 }),
			}),
		lname: z
			.string()
			.min(1, t("validationErrors:required"))
			.max(60, {
				message: t("validationErrors:maxLength", { number: 60 }),
			}),
		email: z
			.string()
			.refine(
				(value) => value === "" || z.string().email().safeParse(value).success,
				{
					message: t("validationErrors:invalidEmail"),
				}
			),
		tel: z
			.string()
			.refine(
				(value) =>
					value === "" || z.string().regex(phoneRegex).safeParse(value).success,
				{
					message: t("validationErrors:invalidPhoneNumber"),
				}
			),
		id: z.optional(z.string()),
	});
};

export const newPasswordSchema = (t) => {
	return z
		.object({
			password: z.string().min(1, t("validationErrors:required")),
			passwordCheck: z.string().min(1, t("validationErrors:required")),
		})
		.refine((data) => data.password === data.passwordCheck, {
			message: t("validationErrors:notEqualPassword"),
			path: ["passwordCheck"],
		});
};
