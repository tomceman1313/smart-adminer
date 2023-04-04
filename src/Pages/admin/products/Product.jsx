import { useEffect, useState } from "react";
import InputBox from "../../Components/basic/InputBox";
import { useForm } from "react-hook-form";
import { faShoppingCart, faInfo } from "@fortawesome/free-solid-svg-icons";

export default function Product() {
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Produkt";
		document.getElementById("banner-desc").innerHTML = "Správa produktu a jeho tvorba";
	}, []);

	return (
		<div>
			<section>
				<h2>Základní informace:</h2>
				<InputBox placeholder="Název" register={register} type="text" name="name" icon={faShoppingCart} isRequired={true} />
				<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faInfo} isRequired={true} />
			</section>
		</div>
	);
}
