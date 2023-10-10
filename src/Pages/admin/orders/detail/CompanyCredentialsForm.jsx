import { faBuilding, faCopyright, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import InputBox from "../../../Components/basic/InputBox";

export default function CompanyCredentialsForm({ register, customer }) {
	const [isVisible, setIsVisible] = useState(customer?.company_name ? true : false);
	return (
		<>
			{customer && (
				<div>
					<h3>Nákup na firmu:</h3>
					{isVisible ? (
						<>
							<InputBox placeholder="Název firmy" register={register} name="company_name" icon={faCopyright} />
							<InputBox placeholder="IČ" register={register} name="ic" icon={faBuilding} />
							<InputBox placeholder="DIČ" register={register} name="dic" icon={faHandHoldingDollar} />
						</>
					) : (
						<button type="button" onClick={() => setIsVisible(true)}>
							Přidat
						</button>
					)}
				</div>
			)}
		</>
	);
}
