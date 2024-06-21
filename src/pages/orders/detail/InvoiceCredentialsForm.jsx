import {
	faAt,
	faBullseye,
	faIdBadge,
	faImagePortrait,
	faLocationDot,
	faLocationPin,
	faPhone,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import InputBox from "../../../components/basic/InputBox";
import { useTranslation } from "react-i18next";

export default function InvoiceCredentialsForm({ customer }) {
	const { t } = useTranslation("orders");
	return (
		<>
			{customer && (
				<div>
					<h3>{t("headerInvoiceCredentials")}</h3>
					<>
						<InputBox
							placeholder={t("placeholderFirstName")}
							defaultValue={customer.fname}
							name="fname"
							icon={faImagePortrait}
						/>
						<InputBox
							placeholder={t("placeholderLastName")}
							defaultValue={customer.lname}
							name="lname"
							icon={faIdBadge}
						/>
						<InputBox
							placeholder={t("placeholderPhone")}
							defaultValue={customer.phone}
							type="tel"
							name="phone"
							icon={faPhone}
						/>
						<InputBox
							placeholder={t("placeholderEmail")}
							defaultValue={customer.email}
							type="email"
							name="email"
							icon={faAt}
						/>
						<InputBox
							placeholder={t("placeholderAddress")}
							defaultValue={customer.address}
							name="address"
							icon={faLocationDot}
						/>
						<InputBox
							placeholder={t("placeholderCity")}
							defaultValue={customer.city}
							name="city"
							icon={faLocationPin}
						/>
						<InputBox
							placeholder={t("placeholderPostalCode")}
							defaultValue={customer.postal_code}
							name="postal_code"
							icon={faBullseye}
						/>
					</>
				</div>
			)}
		</>
	);
}
