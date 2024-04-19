import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import CategoriesController from "../../components/common/categories-controller/CategoriesController";
import ItemsController from "../../components/common/items-controller/ItemsController";
import useBasicApiFunctions from "../../hooks/useBasicApiFunctions";
import useItemsControllerApiFunctions from "../../hooks/useItemsControllerApiFunctions";
import DocumentList from "./DocumentList";
import EditDocument from "./EditDocument";
import NewDocument from "./NewDocument";
import css from "./css/Documents.module.css";

export default function DocumentsPage() {
	const { t } = useTranslation("documents");
	const { getAll, getByCategory, remove, updateOrder } = useBasicApiFunctions();
	const { multipleDelete, searchByName } = useItemsControllerApiFunctions();
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [editedDocument, setEditedDocument] = useState(null);
	const [isMultiSelection, setIsMultiSelection] = useState(false);
	const selectedDocuments = useRef(new Map());

	const [documents, setDocuments] = useState(null);
	const [searchedName, setSearchedName] = useState("");
	const { refetch } = useQuery({
		queryKey: ["documents", selectedCategory, searchedName],
		queryFn: async () => {
			let data;
			if (searchedName !== "") {
				data = await searchByName("documents", searchedName, selectedCategory);
			} else if (selectedCategory) {
				data = await getByCategory("documents", selectedCategory.id);
			} else {
				data = await getAll("documents");
				setSelectedCategory(null);
			}
			setDocuments(data);
			return data;
		},
	});

	async function deleteDocumentHandler(id) {
		await remove("documents", id, t("positiveTextDocumentDeleted"));
		refetch();
	}

	async function deleteDocumentsHandler(ids) {
		await multipleDelete(ids, t("positiveTextDocumentsDeleted"));
		refetch();
		setIsMultiSelection(false);
	}

	async function orderDocumentsHandler(documentsIds) {
		const categoryId = categories.find((category) => category.name === selectedCategory.name)?.id;
		const data = { category_id: categoryId, documents_ids: documentsIds };
		await updateOrder("documents", data, t("positiveTextOrderChanged"));
	}

	function filterByCategory(id) {
		const categoryName = categories.filter((item) => item.id === id);
		setSelectedCategory(categoryName[0]);
	}

	function editDocument(info) {
		setEditedDocument(info);
	}

	function resetFilter() {
		refetch();
		setSelectedCategory(null);
		setSearchedName("");
	}

	return (
		<div className={css.documents}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<CategoriesController
				categories={categories}
				setCategories={setCategories}
				apiClass="documents"
				filterByCategory={filterByCategory}
				reloadData={refetch}
			/>
			<NewDocument refreshData={refetch} categories={categories} />
			<ItemsController
				setSearchedName={setSearchedName}
				selectedCategory={selectedCategory}
				isMultiSelection={isMultiSelection}
				deleteItems={deleteDocumentsHandler}
				resetFilter={resetFilter}
				selectedItems={selectedDocuments}
				toggleMultiSelectionActive={() => setIsMultiSelection((prev) => !prev)}
				settingsConfig={{
					deleteQuestion: t("alertDeleteMultipleDocuments"),
					searchInput: t("placeholderSearchInput"),
					multiSelection: true,
					allItemsText: t("textAllDocuments"),
				}}
			/>
			<DocumentList
				documents={documents}
				setDocuments={setDocuments}
				deleteDocumentHandler={deleteDocumentHandler}
				deleteDocumentsHandler={deleteDocumentsHandler}
				setDocumentsOrderHandler={orderDocumentsHandler}
				editDocument={editDocument}
				selectedCategory={selectedCategory}
				resetFilter={resetFilter}
				selectedDocuments={selectedDocuments}
				isMultiSelection={isMultiSelection}
			/>
			<AnimatePresence>
				{editedDocument && (
					<EditDocument editedDocument={editedDocument} categories={categories} refreshData={refetch} setVisible={setEditedDocument} />
				)}
			</AnimatePresence>
		</div>
	);
}
