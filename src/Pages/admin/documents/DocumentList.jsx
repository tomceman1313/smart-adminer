import { useEffect, useState, useRef } from "react";
import useInteraction from "../../Hooks/useInteraction";
import { getAll, remove } from "../../modules/ApiFunctions";
import { multipleDelete } from "../../modules/ApiDocuments";

import css from "./css/Documents.module.css";
import Document from "./Document";
import { AnimatePresence } from "framer-motion";

const DocumentList = ({ documents, setDocuments, auth, selectedCategory, setSelectedCategory }) => {
	const { setMessage, setAlert } = useInteraction();
	const [multiSelection, setMultiSelection] = useState(false);
	const selectedDocuments = useRef(new Map());

	useEffect(() => {
		getAll("documents", setDocuments, auth);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const deleteDocument = (e) => {
		setAlert({ id: e.target.parentNode.id, question: "Smazat dokument?", positiveHandler: deleteDocumentHandler });
	};

	const deleteDocumentHandler = (id) => {
		remove("documents", id, setMessage, "Dokument byl smazán", "Dokument se nepodařilo smazat", auth);
		getAll("documents", setDocuments, auth);
	};

	const deleteDocuments = () => {
		let images = selectedDocuments.current;
		let ids = [];
		images.forEach((value) => {
			ids.push(value);
		});
		setAlert({ id: ids, question: "Smazat obrázky?", positiveHandler: deleteDocumentsHandler });
	};

	const deleteDocumentsHandler = async (ids) => {
		multipleDelete(ids, auth, setMessage);
		await getAll("documents", setDocuments, auth);
	};

	const multiselectControl = () => {
		if (multiSelection) {
			selectedDocuments.current = new Map();
		}
		setMultiSelection((prev) => !prev);
	};

	const resetFilter = () => {
		setSelectedCategory(null);
		getAll("documents", setDocuments, auth);
	};

	return (
		<>
			<section className={css.filter}>
				<h3>{selectedCategory != null ? "Soubory kategorie: " + selectedCategory : "Všechny soubory"}</h3>
				<div>
					{multiSelection && (
						<button className="red_button" onClick={deleteDocuments}>
							Smazat vybrané
						</button>
					)}
					<button onClick={multiselectControl}>{multiSelection ? "Zrušit výběr" : "Vybrat"}</button>
					<button onClick={resetFilter}>Odstanit filtr</button>
				</div>
			</section>

			<section className={`${css.document_list} no-section`}>
				<AnimatePresence>{documents && documents.map((el) => <Document key={el.id} info={el} deleteDocument={deleteDocument} multiSelection={multiSelection} selectedDocuments={selectedDocuments} />)}</AnimatePresence>
			</section>
		</>
	);
};

export default DocumentList;
