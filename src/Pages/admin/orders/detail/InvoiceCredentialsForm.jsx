import { faAt, faBullseye, faIdBadge, faImagePortrait, faLocationDot, faLocationPin, faPhone } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import InputBox from "../../../Components/basic/InputBox";

export default function InvoiceCredentialsForm({ register, customer }) {
	return (
		<>
			{customer && (
				<div>
					<h3>Fakturační údaje:</h3>
					<>
						<InputBox
							placeholder="Křestní jméno"
							defaultValue={customer.fname}
							register={register}
							name="fname"
							icon={faImagePortrait}
							isRequired={true}
						/>
						<InputBox placeholder="Příjmení" defaultValue={customer.lname} register={register} name="lname" icon={faIdBadge} isRequired={true} />
						<InputBox
							placeholder="Telefon"
							defaultValue={customer.phone}
							register={register}
							type="tel"
							name="phone"
							icon={faPhone}
							isRequired={true}
						/>
						<InputBox placeholder="Email" defaultValue={customer.email} register={register} type="email" name="email" icon={faAt} isRequired={true} />
						<InputBox
							placeholder="Adresa (ulice, č.p.)"
							defaultValue={customer.address}
							register={register}
							name="address"
							icon={faLocationDot}
							isRequired={true}
						/>
						<InputBox placeholder="Město" defaultValue={customer.city} register={register} name="city" icon={faLocationPin} isRequired={true} />
						<InputBox
							placeholder="PSČ"
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
