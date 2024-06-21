import { faFont } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputBox from "../../components/basic/InputBox";
import css from "../../components/common/categories-controller/Category.module.css";
import Item from "../../components/common/controlled-item/Item";
import warningToast from "../../components/common/warning-toast/WarningToast";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import Form from "../../components/basic/form/Form";

export default function RolesController({ roles, reload }) {
	const { t } = useTranslation("profiles");
	const { create, edit, remove } = useBasicApiFunctions();
	const formMethods = useForm();

	const createHandler = async (data) => {
		if (roles.find((role) => role.name === data.name)) {
			warningToast(t("messageNameIsTaken"));
			return;
		}
		await create("users/roles", data, t("positiveTextCreatedRole"));
		formMethods.setValue("name", "");
		reload();
	};

	const updateHandler = async (data) => {
		await edit("users/roles", data, t("positiveTextUpdatedRole"));
		reload();
	};

	const removeHandler = async (id) => {
		await remove("users/roles", id, t("positiveTextDeletedRole"));
		reload();
	};

	return (
		<section className={`${css.category} half-section`}>
			<h2>{t("headerRoles")}</h2>
			<ul className={css.category_list}>
				{roles?.length > 0 ? (
					roles.map((el) => (
						<Item
							key={el.id}
							el={el}
							remove={removeHandler}
							edit={updateHandler}
							deleteQuestion={t("alertDeleteRole", { name: el.name })}
						/>
					))
				) : (
					<p>{t("noDataFound")}</p>
				)}
			</ul>
			<div className={css.blur}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<h3>{t("headerAddRole")}</h3>
			<Form onSubmit={createHandler} formContext={formMethods}>
				<InputBox
					placeholder={t("placeholderRoleName")}
					name="name"
					type="text"
					icon={faFont}
					white={false}
					isRequired
				/>
				<button>{t("createButton")}</button>
			</Form>
		</section>
	);
}
