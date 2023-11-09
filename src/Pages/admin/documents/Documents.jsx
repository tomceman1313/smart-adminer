import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";

import Category from "../../Components/common/categories-component/Category";
import NewDocument from "./NewDocument";
import DocumentList from "./DocumentList";
import css from "./css/Documents.module.css";
import { AnimatePresence } from "framer-motion";
import EditDocument from "./EditDocument";
import { getAll, getByCategory } from "../../modules/ApiFunctions";

const Documents = () => {
	const auth = useAuth();
	const [documents, setDocuments] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [editedDocument, setEditedDocument] = useState(false);

	useEffect(() => {
		loadData();
	}, []);

	const editDocument = (info) => {
		setEditedDocument(info);
	};

	async function loadData() {
		const data = await getAll("documents");
		setSelectedCategory(null);
		setDocuments(data);
	}

	async function filterByCategory(id) {
		const data = await getByCategory("documents", id);
		setDocuments(data);
		const categoryName = categories.filter((item) => item.id === id);
		setSelectedCategory(categoryName[0].name);
	}

	return (
		<div className={css.documents}>
			<Category
				categories={categories}
				setCategories={setCategories}
				apiClass="documents"
				filterByCategory={filterByCategory}
				reloadData={loadData}
			/>
			<NewDocument auth={auth} refreshData={loadData} categories={categories} />
			<DocumentList
				auth={auth}
				documents={documents}
				reloadData={loadData}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
				editDocument={editDocument}
			/>
			<AnimatePresence>
				{editedDocument && (
					<EditDocument editedDocument={editedDocument} auth={auth} categories={categories} refreshData={loadData} setVisible={setEditedDocument} />
				)}
			</AnimatePresence>
		</div>
	);
};

export default Documents;
