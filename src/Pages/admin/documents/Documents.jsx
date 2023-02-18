import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";

import Categories from "./Categories";
import NewDocument from "./NewDocument";
import DocumentList from "./DocumentList";
import css from "./css/Documents.module.css";

const Documents = () => {
	const auth = useAuth();
	const [documents, setDocuments] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Dokumentový server";
		document.getElementById("banner-desc").innerHTML = "Správa dokumentů a tvorba kategorií pro jejich rozřazení";
	}, []);
	return (
		<div className={css.documents}>
			<Categories auth={auth} setDocuments={setDocuments} setSelectedCategory={setSelectedCategory} categories={categories} setCategories={setCategories} />
			<NewDocument auth={auth} setDocuments={setDocuments} categories={categories} />
			<DocumentList auth={auth} documents={documents} setDocuments={setDocuments} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
		</div>
	);
};

export default Documents;
