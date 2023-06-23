import { useEffect, useRef, useState } from "react";
import useInteraction from "../../Hooks/useInteraction";
import { multipleDelete } from "../../modules/ApiDocuments";
import { remove } from "../../modules/ApiFunctions";

import { AnimatePresence } from "framer-motion";
import Document from "./Document";
import css from "./css/Documents.module.css";

export default function DocumentList({ documents, loadData, auth, selectedCategory, setSelectedCategory, editDocument }) {
	const { setMessage, setAlert } = useInteraction();
	const [multiSelection, setMultiSelection] = useState(false);
	const selectedDocuments = useRef(new Map());

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const deleteDocument = (e) => {
		setAlert({ id: e.target.parentNode.id, question: "Smazat dokument?", positiveHandler: deleteDocumentHandler });
	};

	const deleteDocumentHandler = (id) => {
		remove("documents", id, setMessage, "Dokument byl smazán", auth);
		loadData();
	};

	const deleteDocuments = () => {
		let images = selectedDocuments.current;
		let ids = [];
		images.forEach((value) => {
			ids.push(value);
		});
		setAlert({ id: ids, question: "Smazat dokumenty?", positiveHandler: deleteDocumentsHandler });
	};

	const deleteDocumentsHandler = (ids) => {
		multipleDelete(ids, auth, setMessage);
		loadData();
	};

	const multiselectControl = () => {
		if (multiSelection) {
			selectedDocuments.current = new Map();
		}
		setMultiSelection((prev) => !prev);
	};

	const resetFilter = () => {
		setSelectedCategory(null);
		loadData();
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
				<AnimatePresence>
					{documents &&
						documents.map((el) => (
							<Document
								key={el.id}
								info={el}
								deleteDocument={deleteDocument}
								multiSelection={multiSelection}
								selectedDocuments={selectedDocuments}
								editDocument={editDocument}
							/>
						))}
				</AnimatePresence>
			</section>
		</>
	);
}
