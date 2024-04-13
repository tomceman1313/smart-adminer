import { faBuilding, faCopyright, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import InputBox from "../../../components/basic/InputBox";
import { useTranslation } from "react-i18next";

export default function CompanyCredentialsForm({ register, customer }) {
	const { t } = useTranslation("orders");
	const [isVisible, setIsVisible] = useState(customer?.company_name ? true : false);
	return (
		<>
			{customer && (
				<div>
					<h3>
						{t("headerCompanyInfo")}
						{!isVisible && (
							<button type="button" onClick={() => setIsVisible(true)} className="small_button">
								{t("buttonAdd")}
							</button>
						)}
					</h3>
					{isVisible && (
						<>
							<InputBox
								placeholder={t("placeholderCompanyName")}
								register={register}
								name="company_name"
								defaultValue={customer.company_name}
								icon={faCopyright}
							/>
							<InputBox placeholder={t("placeholderCIN")} register={register} name="ic" defaultValue={customer.ic} icon={faBuilding} />
							<InputBox placeholder={t("placeholderVAT_ID")} register={register} name="dic" defaultValue={customer.dic} icon={faHandHoldingDollar} />
						</>
					)}
				</div>
			)}
		</>
	);
}
