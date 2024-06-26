import {
	faAt,
	faCommentDots,
	faIdBadge,
	faImagePortrait,
	faMobileScreen,
	faMobileScreenButton,
	faUserGraduate,
	faUserTag,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../components/basic/InputBox";
import Switch from "../../components/basic/switch/Switch";
import { convertBase64 } from "../../modules/BasicFunctions";

import { useTranslation } from "react-i18next";
import CategorySelector from "../../components/basic/category-selector/CategorySelector";
import ImageInput from "../../components/basic/image-input/ImageInput";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import css from "./Employees.module.css";

export default function Employee({
	employee,
	setEmployee,
	getData,
	departments,
	auth,
}) {
	const { t } = useTranslation("employees");
	const { edit, create } = useBasicApiFunctions();

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
			if (employee.image && data.image) {
				data.deleted_image = employee.image;
			}
			delete data.image;
		}
		data.departments = pickedDepartments.filter(
			(el) => !originalDepartments.current.find((dep) => dep.name === el.name)
		);
		if (employee?.id) {
			data.departments_deleted = deletedDepartments.current;
			await edit("employees", data, t("positiveTextEditEmployee"));
		} else {
			delete data.id;
			delete data.department_id;
			await create("employees", data, t("positiveTextCreateEmployee"));
		}
		getData();
		resetForm();
		setEmployee(false);
	}

	function resetForm() {
		reset({
			degree_before: "",
			fname: "",
			lname: "",
			degree_after: "",
			phone: "",
			email: "",
			position: "",
			notes: "",
			id: "",
		});
		setPickedDepartments([]);
		originalDepartments.current = [];
		deletedDepartments.current = [];
		setEmployee(null);
	}

	function setData() {
		setValue("degree_before", employee.degree_before);
		setValue("fname", employee.fname);
		setValue("lname", employee.lname);
		setValue("degree_after", employee.degree_after);
		setValue("phone", employee.phone);
		setValue("phone_secondary", employee.phone_secondary);
		setValue("email", employee.email);
		setValue("position", employee.position);
		setValue("notes", employee.notes);
		setValue("active", employee.active);
		setValue("id", employee.id);

		setPickedDepartments(employee.departments);
		originalDepartments.current = employee.departments;
	}

	return (
		<AnimatePresence>
			{employee && (
				<motion.section
					className={css.edit}
					initial={{ x: -600 }}
					animate={{ x: 0 }}
					exit={{ x: -600 }}
					transition={{ type: "spring", duration: 1 }}
				>
					<h2>{t("headerEmployee")}</h2>
					<FontAwesomeIcon
						id={css.close}
						icon={faXmark}
						onClick={() => {
							setEmployee(null);
							resetForm();
						}}
					/>
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputBox
							placeholder={t("placeholderDegreeBefore")}
							register={register}
							type="text"
							name="degree_before"
							icon={faUserGraduate}
						/>
						<InputBox
							placeholder={t("placeholderFirstName")}
							register={register}
							type="text"
							name="fname"
							icon={faImagePortrait}
							isRequired={true}
						/>
						<InputBox
							placeholder={t("placeholderLastName")}
							register={register}
							type="text"
							name="lname"
							icon={faIdBadge}
							isRequired={true}
						/>
						<InputBox
							placeholder={t("placeholderDegreeAfter")}
							register={register}
							type="text"
							name="degree_after"
							icon={faUserGraduate}
						/>

						<InputBox
							placeholder={t("placeholderPhone")}
							register={register}
							type="tel"
							name="phone"
							icon={faMobileScreen}
						/>
						<InputBox
							placeholder={t("placeholderSecondaryPhone")}
							register={register}
							type="tel"
							name="phone_secondary"
							icon={faMobileScreenButton}
						/>
						<InputBox
							placeholder={t("placeholderEmail")}
							register={register}
							type="email"
							name="email"
							icon={faAt}
						/>

						<CategorySelector
							categories={departments}
							selectedCategories={pickedDepartments}
							setSelectedCategories={setPickedDepartments}
							placeholder={t("placeholderDepartmentSelect")}
						/>

						<InputBox
							placeholder={t("placeholderPosition")}
							register={register}
							type="text"
							name="position"
							icon={faUserTag}
							isRequired={true}
						/>

						<InputBox
							placeholder={t("placeholderNotes")}
							register={register}
							type="text"
							name="notes"
							icon={faCommentDots}
						/>

						<ImageInput
							name="image"
							image={employee.image}
							path="employees"
							register={register}
							required={false}
						/>

						<Switch
							name="active"
							label={t("placeholderIsVisible")}
							register={register}
						/>

						<input type="hidden" {...register("id")} />

						<button style={{ marginTop: "20px" }}>
							{employee?.id
								? t("buttonUpdateEmployee")
								: t("buttonCreateEmployee")}
						</button>
					</form>
				</motion.section>
			)}
		</AnimatePresence>
	);
}
