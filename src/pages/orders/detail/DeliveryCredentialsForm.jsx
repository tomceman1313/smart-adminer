import { useState } from "react";
import { faBullseye, faIdBadge, faImagePortrait, faLocationDot, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import InputBox from "../../../components/basic/InputBox";
import { useTranslation } from "react-i18next";

export default function DeliveryCredentialsForm({ register, customer }) {
	const { t } = useTranslation("orders");
	const [isVisible, setIsVisible] = useState(customer?.delivery_address ? true : false);
	return (
		<>
			{customer && (
				<div>
					<h3>
						{t("headerDeliveryCredentials")}
						{!isVisible && (
							<button type="button" onClick={() => setIsVisible(true)} className="small_button">
								{t("buttonAdd")}
							</button>
						)}
					</h3>
					{isVisible && (
						<>
							<InputBox
								placeholder={t("placeholderFirstName")}
								defaultValue={customer.delivery_fname}
								register={register}
								name="delivery_fname"
								icon={faImagePortrait}
							/>
							<InputBox
								placeholder={t("placeholderLastName")}
								defaultValue={customer.delivery_lname}
								register={register}
								name="delivery_lname"
								icon={faIdBadge}
							/>
							<InputBox
								placeholder={t("placeholderAddress")}
								defaultValue={customer.delivery_address}
								register={register}
								name="delivery_address"
								icon={faLocationDot}
							/>
							<InputBox
								placeholder={t("placeholderCity")}
								defaultValue={customer.delivery_city}
								register={register}
								name="delivery_city"
								icon={faLocationPin}
							/>
							<InputBox
								placeholder={t("placeholderPostalCode")}
								defaultValue={customer.delivery_postal_code ? customer.delivery_postal_code : ""}
								register={register}
								name="delivery_postal_code"
								icon={faBullseye}
							/>
						</>
					)}
				</div>
			)}
		</>
	);
}
