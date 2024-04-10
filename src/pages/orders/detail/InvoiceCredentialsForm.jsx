import { faAt, faBullseye, faIdBadge, faImagePortrait, faLocationDot, faLocationPin, faPhone } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import InputBox from "../../../components/basic/InputBox";
import { useTranslation } from "react-i18next";

export default function InvoiceCredentialsForm({ register, customer }) {
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
							register={register}
							name="fname"
							icon={faImagePortrait}
							isRequired={true}
						/>
						<InputBox
							placeholder={t("placeholderLastName")}
							defaultValue={customer.lname}
							register={register}
							name="lname"
							icon={faIdBadge}
							isRequired={true}
						/>
						<InputBox
							placeholder={t("placeholderPhone")}
							defaultValue={customer.phone}
							register={register}
							type="tel"
							name="phone"
							icon={faPhone}
							isRequired={true}
						/>
						<InputBox
							placeholder={t("placeholderEmail")}
							defaultValue={customer.email}
							register={register}
							type="email"
							name="email"
							icon={faAt}
							isRequired={true}
						/>
						<InputBox
							placeholder={t("placeholderAddress")}
							defaultValue={customer.address}
							register={register}
							name="address"
							icon={faLocationDot}
							isRequired={true}
						/>
						<InputBox
							placeholder={t("placeholderCity")}
							defaultValue={customer.city}
							register={register}
							name="city"
							icon={faLocationPin}
							isRequired={true}
						/>
						<InputBox
							placeholder={t("placeholderPostalCode")}
							defaultValue={customer.postal_code}
							register={register}
							name="postal_code"
							icon={faBullseye}
							isRequired={true}
						/>
					</>
				</div>
			)}
		</>
	);
}
