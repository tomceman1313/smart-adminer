import { useState, useEffect, useRef } from "react";
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
import { create, edit } from "../../modules/ApiFunctions";
import useInteraction from "../../Hooks/useInteraction";

import { useForm } from "react-hook-form";

export default function Employee({ employee, setEmployee, getData, setVisible, departments, auth }) {
	const { setMessage } = useInteraction();

	const { register, handleSubmit, reset, setValue } = useForm();
	const [imageIsSet, setImageIsSet] = useState(null);
	const [pickedDepartments, setPickedDepartments] = useState([]);
	const deletedDepartments = useRef([]);
	const originalDepartments = useRef([]);

	useEffect(() => {
		if (employee) {
			setData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employee]);

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

		data.departments = pickedDepartments.filter((el) => !originalDepartments.current.includes(el));
		if (employee) {
			data.departments_deleted = deletedDepartments.current;
			await edit("employees", data, setMessage, "Profil zaměstnance byl upraven", auth);
		} else {
			delete data.id;
			delete data.department_id;
			await create("employees", data, setMessage, "Profil zaměstnance byl vytvořen", auth);
		}
		getData();
		resetForm();
		setVisible(false);
	}

	function resetForm() {
		reset({ degree_before: "", fname: "", lname: "", degree_after: "", phone: "", email: "", position: "", notes: "", id: "" });
		setImageIsSet(false);
		setPickedDepartments([]);
		originalDepartments.current = null;
		setEmployee(null);
	}

	function setData() {
		setValue("degree_before", employee.degree_before);
		setValue("fname", employee.fname);
		setValue("lname", employee.lname);
		setValue("degree_after", employee.degree_after);
		setValue("phone", employee.phone);
		setValue("email", employee.email);
		setValue("position", employee.position);
		setValue("notes", employee.notes);
		setValue("id", employee.id);

		setImageIsSet(employee.image);
		setPickedDepartments(employee.departments);
		originalDepartments.current = employee.departments;
	}

	const chooseCategory = (e) => {
		const name = departments.filter((item) => item.id === parseInt(e.target.value));
		const alreadyIn = pickedDepartments.find((item) => item.id === parseInt(e.target.value));
		setValue("department_id", "default");
		if (alreadyIn) {
			return;
		}

		if (name.length !== 0) {
			setPickedDepartments((prev) => [...prev, name[0]]);
		}
	};

	const removeFromPicked = (e) => {
		const removed = pickedDepartments.filter((item) => item.id !== parseInt(e.target.id));
		deletedDepartments.current.push(parseInt(e.target.id));
		setPickedDepartments(removed);
	};

	return (
		<motion.section className={css.edit} initial={{ x: -600 }} animate={{ x: 0 }} exit={{ x: -600 }} transition={{ type: "spring", duration: 1 }}>
			<h2>Profil zaměstnance</h2>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible((prev) => !prev);
					resetForm();
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
					<select defaultValue={"default"} {...register("department_id")} onChange={chooseCategory} required>
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

				<ul className={css.picked_categories}>
					{pickedDepartments &&
						pickedDepartments.map((el) => (
							<li key={`pickedDep-${el.id}`} id={el.id} onClick={removeFromPicked}>
								{el.name}
							</li>
						))}
				</ul>

				<InputBox placeholder="Pozice" register={register} type="text" name="position" icon={faUserTag} isRequired={false} />

				<InputBox placeholder="Poznámky" register={register} type="text" name="notes" icon={faCommentDots} isRequired={false} />

				<div className={`${cssBasic.input_box}`}>
					{imageIsSet ? (
						<div className={cssBasic.image_box}>
							<button type="button" onClick={() => openImage(`${publicPath}/images/employees/${imageIsSet}`)}>
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
