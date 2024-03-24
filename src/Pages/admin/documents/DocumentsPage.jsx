import { AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Category from "../../Components/common/categories-component/Category";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { multipleDelete } from "../../modules/ApiDocuments";
import { getAll, getByCategory, remove, updateOrder } from "../../modules/ApiFunctions";
import DocumentList from "./DocumentList";
import EditDocument from "./EditDocument";
import NewDocument from "./NewDocument";
import ItemsController from "../../Components/common/items-controller/ItemsController";
import css from "./css/Documents.module.css";

export default function DocumentsPage() {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const [documents, setDocuments] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [editedDocument, setEditedDocument] = useState(null);
	const [isMultiSelection, setIsMultiSelection] = useState(false);
	const selectedDocuments = useRef(new Map());

	useEffect(() => {
		loadData();
	}, []);

	function editDocument(info) {
		setEditedDocument(info);
	}

	async function loadData() {
		const data = await getAll("documents");
		setSelectedCategory(null);
		setDocuments(data);
	}

	async function filterByCategory(id) {
		const data = await getByCategory("documents", id);
		setDocuments(data);
		const categoryName = categories.filter((item) => item.id === id);
		setSelectedCategory(categoryName[0]);
	}

	async function deleteDocumentHandler(id) {
		await remove("documents", id, setMessage, "Dokument byl smazán", auth);
		loadData();
	}

	async function deleteDocumentsHandler(ids) {
		await multipleDelete(ids, auth, setMessage);
		loadData();
		setIsMultiSelection(false);
	}

	async function orderDocumentsHandler(documentsIds) {
		const categoryId = categories.find((category) => category.name === selectedCategory.name)?.id;
		const data = { category_id: categoryId, documents_ids: documentsIds };
		await updateOrder("documents", data, setMessage, "Pořadí dokumentů bylo upraveno", auth);
	}

	return (
		<div className={css.documents}>
			<Helmet>
				<title>Dokumenty | SmartAdminer</title>
			</Helmet>
			<Category
				categories={categories}
				setCategories={setCategories}
				apiClass="documents"
				filterByCategory={filterByCategory}
				reloadData={loadData}
			/>
			<NewDocument auth={auth} refreshData={loadData} categories={categories} />
			<ItemsController
				apiClass="documents"
				setState={setDocuments}
				selectedCategory={selectedCategory}
				isMultiSelection={isMultiSelection}
				deleteItems={deleteDocumentsHandler}
				resetFilter={loadData}
				selectedItems={selectedDocuments}
				toggleMultiSelectionActive={() => setIsMultiSelection((prev) => !prev)}
				settingsConfig={{
					deleteQuestion: "Smazat vybrané dokumenty?",
					searchInput: "Název dokumentu",
					multiSelection: true,
					allItemsText: "Veškeré dokumenty",
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
				resetFilter={loadData}
				selectedDocuments={selectedDocuments}
				isMultiSelection={isMultiSelection}
			/>
			<AnimatePresence>
				{editedDocument && (
					<EditDocument editedDocument={editedDocument} auth={auth} categories={categories} refreshData={loadData} setVisible={setEditedDocument} />
				)}
			</AnimatePresence>
		</div>
	);
}
