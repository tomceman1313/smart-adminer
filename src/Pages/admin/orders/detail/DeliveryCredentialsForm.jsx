import { useState } from "react";
import { faBullseye, faIdBadge, faImagePortrait, faLocationDot, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import InputBox from "../../../Components/basic/InputBox";

export default function DeliveryCredentialsForm({ register, customer }) {
	const [isVisible, setIsVisible] = useState(customer?.delivery_address ? true : false);
	return (
		<>
			{customer && (
				<div>
					<h3>
						Doručovací údaje:
						{!isVisible && (
							<button type="button" onClick={() => setIsVisible(true)} className="small_button">
								Přidat
							</button>
						)}
					</h3>
					{isVisible && (
						<>
							<InputBox
								placeholder="Křestní jméno"
								defaultValue={customer.delivery_fname}
								register={register}
								name="delivery_fname"
								icon={faImagePortrait}
							/>
							<InputBox placeholder="Příjmení" defaultValue={customer.delivery_lname} register={register} name="delivery_lname" icon={faIdBadge} />
							<InputBox
								placeholder="Adresa (ulice, č.p.)"
								defaultValue={customer.delivery_address}
								register={register}
								name="delivery_address"
								icon={faLocationDot}
							/>
							<InputBox placeholder="Město" defaultValue={customer.delivery_city} register={register} name="delivery_city" icon={faLocationPin} />
							<InputBox
								placeholder="PSČ"
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
