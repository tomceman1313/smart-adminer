import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";

import Categories from "./Categories";
import NewDocument from "./NewDocument";
import DocumentList from "./DocumentList";
import css from "./css/Documents.module.css";
import { AnimatePresence } from "framer-motion";
import EditDocument from "./EditDocument";
import { getAll } from "../../modules/ApiFunctions";

const Documents = () => {
	const auth = useAuth();
	const [documents, setDocuments] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [editedDocument, setEditedDocument] = useState(false);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Dokumentový server";
		document.getElementById("banner-desc").innerHTML = "Správa dokumentů a tvorba kategorií pro jejich rozřazení";
	}, []);

	const editDocument = (info) => {
		setEditedDocument(info);
	};

	async function loadData() {
		const data = await getAll("documents", auth);
		setDocuments(data);
	}

	return (
		<div className={css.documents}>
			<Categories
				auth={auth}
				setDocuments={setDocuments}
				setSelectedCategory={setSelectedCategory}
				categories={categories}
				setCategories={setCategories}
			/>
			<NewDocument auth={auth} setDocuments={setDocuments} categories={categories} />
			<DocumentList
				auth={auth}
				documents={documents}
				loadData={loadData}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
				editDocument={editDocument}
			/>
			<AnimatePresence>
				{editedDocument && (
					<EditDocument
						editedDocument={editedDocument}
						auth={auth}
						categories={categories}
						setDocuments={setDocuments}
						setVisible={setEditedDocument}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Documents;
