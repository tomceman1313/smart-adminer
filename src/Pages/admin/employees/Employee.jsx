import {
	faAt,
	faBuildingUser,
	faCommentDots,
	faIdBadge,
	faImagePortrait,
	faMobileScreen,
	faUserGraduate,
	faUserTag,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import useInteraction from "../../Hooks/useInteraction";
import { create, edit } from "../../modules/ApiFunctions";
import { convertBase64 } from "../../modules/BasicFunctions";

import ImageInput from "../../Components/basic/image-input/ImageInput";
import cssBasic from "../styles/Basic.module.css";
import css from "./Employees.module.css";

export default function Employee({ employee, setEmployee, getData, departments, auth }) {
	const { setMessage } = useInteraction();

	const { register, handleSubmit, reset, setValue } = useForm();
	const [pickedDepartments, setPickedDepartments] = useState([]);
	const deletedDepartments = useRef([]);
	const originalDepartments = useRef([]);

	useEffect(() => {
		if (employee?.id) {
			setData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employee]);

	async function onSubmit(data) {
		if (data.image?.[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
			if (employee) {
				data.previous_image = employee.image;
			}
		} else {
			delete data.image;
		}
		data.departments = pickedDepartments.filter((el) => !originalDepartments.current.includes(el));
		console.log(data);
		if (employee?.id) {
			data.departments_deleted = deletedDepartments.current;
			await edit("employees", data, setMessage, "Profil zaměstnance byl upraven", auth);
		} else {
			delete data.id;
			delete data.department_id;
			await create("employees", data, setMessage, "Profil zaměstnance byl vytvořen", auth);
		}
		getData();
		resetForm();
		setEmployee(false);
	}

	function resetForm() {
		reset({ degree_before: "", fname: "", lname: "", degree_after: "", phone: "", email: "", position: "", notes: "", id: "" });
		setPickedDepartments([]);
		originalDepartments.current = null;
		setEmployee(null);
	}

	function setData() {
		console.log(employee);
		setValue("degree_before", employee.degree_before);
		setValue("fname", employee.fname);
		setValue("lname", employee.lname);
		setValue("degree_after", employee.degree_after);
		setValue("phone", employee.phone);
		setValue("email", employee.email);
		setValue("position", employee.position);
		setValue("notes", employee.notes);
		setValue("id", employee.id);

		setPickedDepartments(employee.departments);
		originalDepartments.current = employee.departments;
	}

	const chooseCategory = (e) => {
		const name = departments.filter((item) => item.id === parseInt(e.target.value));
		const alreadyIn = pickedDepartments.find((item) => item.department_id === parseInt(e.target.value));
		setValue("department_id", "");
		if (alreadyIn) {
			return;
		}

		if (name.length !== 0) {
			setPickedDepartments((prev) => [...prev, name[0]]);
		}
	};

	const removeFromPicked = (e) => {
		const removed = pickedDepartments.filter((item) => item.department_id !== parseInt(e.target.id));
		deletedDepartments.current.push(parseInt(e.target.id));
		setPickedDepartments(removed);
	};

	return (
		<AnimatePresence>
			{employee && (
				<motion.section className={css.edit} initial={{ x: -600 }} animate={{ x: 0 }} exit={{ x: -600 }} transition={{ type: "spring", duration: 1 }}>
					<h2>Profil zaměstnance</h2>
					<FontAwesomeIcon
						id={css.close}
						icon={faXmark}
						onClick={() => {
							setEmployee(null);
							resetForm();
						}}
					/>
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputBox placeholder="Titul před jménem" register={register} type="text" name="degree_before" icon={faUserGraduate} />
						<InputBox placeholder="Křestní jméno" register={register} type="text" name="fname" icon={faImagePortrait} isRequired={true} />
						<InputBox placeholder="Příjmení" register={register} type="text" name="lname" icon={faIdBadge} isRequired={true} />
						<InputBox placeholder="Titul za jménem" register={register} type="text" name="degree_after" icon={faUserGraduate} />

						<InputBox placeholder="Telefon" register={register} type="tel" name="phone" icon={faMobileScreen} />
						<InputBox placeholder="Email" register={register} type="email" name="email" icon={faAt} />

						<div className={cssBasic.input_box}>
							<select defaultValue={""} {...register("department_id")} onChange={chooseCategory}>
								<option value="" disabled>
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
									<li key={`pickedDep-${el.department_id}`} id={el.department_id} onClick={removeFromPicked}>
										{el.name}
									</li>
								))}
						</ul>

						<InputBox placeholder="Pozice" register={register} type="text" name="position" icon={faUserTag} isRequired={true} />

						<InputBox placeholder="Poznámky" register={register} type="text" name="notes" icon={faCommentDots} />

						<ImageInput name="image" image={employee.image} path="employees" register={register} />

						<input type="hidden" {...register("id")} />

						<button>Uložit</button>
					</form>
				</motion.section>
			)}
		</AnimatePresence>
	);
}
