import { faBullseye, faIdBadge, faImagePortrait, faLocationDot, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import InputBox from "../../../Components/basic/InputBox";

export default function DeliveryCredentialsForm({ register, customer }) {
	return (
		<>
			{customer && (
				<div>
					<h3>Doručovací údaje:</h3>
					{customer.delivery_address ? (
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
								defaultValue={customer.delivery_postal_code}
								register={register}
								name="delivery_postal_code"
								icon={faBullseye}
							/>
						</>
					) : (
						<button type="button">Přidat</button>
					)}
				</div>
			)}
		</>
	);
}