import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import CategoriesController from "../../components/common/categories-controller/CategoriesController";
import ItemsController from "../../components/common/items-controller/ItemsController";
import useBasicApiFunctions from "../../hooks/useBasicApiFunctions";
import ImageList from "./ImageList";
import NewPicture from "./NewPicture";
import css from "./css/Gallery.module.css";

export default function GalleryPage() {
	const { t } = useTranslation("gallery");
	const { edit, getAll, getByCategory, remove, multipleDelete } = useBasicApiFunctions();
	const { page } = useParams();
	const navigate = useNavigate();

	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	const [isMultiSelectionActive, setIsMultiSelectionActive] = useState(false);
	const selectedImages = useRef(new Map());

	const { data: images, refetch } = useQuery({
		queryKey: ["images", page, selectedCategory],
		queryFn: async () => {
			let data;
			if (selectedCategory) {
				data = await getByCategory("gallery", selectedCategory.id);
			} else {
				data = await getAll("gallery", page);
				setSelectedCategory(null);
			}
			return data.data;
		},
	});

	async function filterImagesByCategory(id) {
		const _selectedCategory = categories.find((item) => item.id === id);
		setSelectedCategory(_selectedCategory);
		navigate("/gallery/");
	}

	async function editImageHandler(data) {
		await edit("gallery", data, t("positiveTextImageUpdated"));
		refetch();
	}

	async function deleteImageHandler(id) {
		await remove("gallery", id, t("positiveTextImageDeleted"));
		refetch();
	}

	async function deleteImagesHandler(ids) {
		await multipleDelete(ids, t("positiveTextImagesDeleted"));
		refetch();
		setIsMultiSelectionActive(false);
		selectedImages.current = new Map();
	}

	function resetFilter() {
		setSelectedCategory(null);
		refetch();
	}

	return (
		<div className={css.gallery}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<CategoriesController
				filterByCategory={filterImagesByCategory}
				categories={categories}
				setCategories={setCategories}
				apiClass="gallery"
				reloadData={refetch}
			/>
			<NewPicture reloadData={refetch} categories={categories} />
			<ItemsController
				selectedCategory={selectedCategory}
				isMultiSelection={isMultiSelectionActive}
				deleteItems={deleteImagesHandler}
				resetFilter={resetFilter}
				selectedItems={selectedImages}
				toggleMultiSelectionActive={() => setIsMultiSelectionActive((prev) => !prev)}
				settingsConfig={{
					deleteQuestion: t("alertDeleteMultipleImages"),
					searchInput: "",
					multiSelection: true,
					allItemsText: t("textAllImages"),
				}}
			/>
			<ImageList
				images={images}
				deleteImageHandler={deleteImageHandler}
				editImageHandler={editImageHandler}
				isMultiSelectionActive={isMultiSelectionActive}
				selectedImages={selectedImages}
			/>
		</div>
	);
}
