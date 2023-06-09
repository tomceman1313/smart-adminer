import { useState } from "react";
import {
	faUserTag,
	faAt,
	faIdBadge,
	faImagePortrait,
	faMobileScreen,
	faXmark,
	faUserGraduate,
	faImage,
	faCommentDots,
	faBuildingUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import cssBasic from "../styles/Basic.module.css";
import css from "./Employees.module.css";
import InputBox from "../../Components/basic/InputBox";
import { convertBase64, openImage, publicPath } from "../../modules/BasicFunctions";

import { useForm } from "react-hook-form";

export default function Employee({ employee, setEmployee, handleEdit }) {
	//TODO Napojit na API metody
	const { register, handleSubmit, reset, setValue } = useForm();
	const [imageIsSet, setImageIsSet] = useState(null);
	const [departments, setDepartments] = useState(null);

	async function onSubmit(data) {
		if (data.image[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
			if (employee) {
				data.previous_image = employee.image;
			}
		} else {
			delete data.image;
		}
		handleEdit(data);
		setEmployee(false);
	}

	function setData() {
		//TODO Naplnění daty
		setValue("", employee);
		setValue("", employee);
		setValue("", employee);
		setValue("", employee);
		setValue("", employee);
		setValue("", employee);
		setValue("", employee);
		setValue("", employee);
		setValue("", employee);
		setValue("", employee);
	}

	return (
		<motion.section className={css.edit} initial={{ x: -600 }} animate={{ x: 0 }} exit={{ x: -600 }} transition={{ type: "spring", duration: 1 }}>
			<h2>Profil zaměstnance</h2>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setEmployee((prev) => !prev);
					reset();
				}}
			/>
			<form onSubmit={handleSubmit(onSubmit)}>
				<InputBox placeholder="Titul před jménem" register={register} type="text" name="degree_before" icon={faUserGraduate} isRequired={false} />
				<InputBox placeholder="Křestní jméno" register={register} type="text" name="fname" icon={faImagePortrait} isRequired={true} />
				<InputBox placeholder="Příjmení" register={register} type="text" name="lname" icon={faIdBadge} isRequired={true} />
				<InputBox placeholder="Titul za jménem" register={register} type="text" name="degree_after" icon={faUserGraduate} isRequired={false} />

				<InputBox placeholder="Telefon" register={register} type="tel" name="phone" icon={faMobileScreen} isRequired={false} />
				<InputBox placeholder="Email" register={register} type="email" name="email" icon={faAt} isRequired={false} />

				<div className={cssBasic.input_box}>
					<select defaultValue={"default"} {...register("category_id")} required>
						<option value="default" disabled>
							-- Zvolit oddělení --
						</option>
						{departments &&
							departments.map((el) => (
								<option key={el.id} value={el.id}>
									{el.name}
								</option>
							))}
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faBuildingUser} />
				</div>

				<InputBox placeholder="Pozice" register={register} type="text" name="position" icon={faUserTag} isRequired={false} />

				<InputBox placeholder="Poznámky" register={register} type="text" name="notes" icon={faCommentDots} isRequired={false} />

				<div className={`${cssBasic.input_box}`}>
					{imageIsSet ? (
						<div className={cssBasic.image_box}>
							<button type="button" onClick={() => openImage(`${publicPath}/images/vacancies/${imageIsSet}`)}>
								Zobrazit obrázek
							</button>
							<button type="button" onClick={() => setImageIsSet(false)}>
								Změnit obrázek
							</button>
						</div>
					) : (
						<input type="file" {...register("image")} accept="image/*" required />
					)}

					<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
				</div>

				<input type="hidden" {...register("id")} />

				<button>Uložit</button>
			</form>
		</motion.section>
	);
}
