import { AnimatePresence } from "framer-motion";
import { DragHandle } from "../../Components/common/sortable/DragHandle";
import SortableItem from "../../Components/common/sortable/SortableItem";
import SortableList from "../../Components/common/sortable/SortableList";
import useInteraction from "../../Hooks/useInteraction";
import Document from "./Document";
import documentCss from "./css/Document.module.css";
import css from "./css/Documents.module.css";

export default function DocumentList({
	documents,
	setDocuments,
	editDocument,
	deleteDocumentHandler,
	setDocumentsOrderHandler,
	selectedCategory,
	selectedDocuments,
	isMultiSelection,
}) {
	const { setAlert } = useInteraction();

	function deleteDocument(e) {
		setAlert({ id: e.target.parentNode.id, question: "Smazat dokument?", positiveHandler: deleteDocumentHandler });
	}

	return (
		<>
			<section className={`no-section`}>
				{documents && (
					<SortableList
						key={selectedCategory ? `sortableList-${selectedCategory}` : "unSortableList"}
						items={documents}
						overlayElement={OverlayDocument}
						setState={setDocuments}
						sortCallbackFunction={setDocumentsOrderHandler}
					>
						<AnimatePresence>
							{documents.length > 0 ? (
								<ul className={css.document_list} role="application">
									{documents.map((document) => (
										<SortableItem
											key={selectedCategory ? `sortable-document-${document.id}` : `document-${document.id}`}
											item={document}
											className={documentCss.document_wrapper}
										>
											<Document
												info={document}
												deleteDocument={deleteDocument}
												multiSelection={isMultiSelection}
												selectedDocuments={selectedDocuments}
												editDocument={editDocument}
											>
												{selectedCategory && <DragHandle id={document.id} />}
											</Document>
										</SortableItem>
									))}
								</ul>
							) : (
								<h3 style={{ textAlign: "center" }}>Nebyly nalezeny žádné dokumenty</h3>
							)}
						</AnimatePresence>
					</SortableList>
				)}
			</section>
		</>
	);
}

function OverlayDocument(active) {
	return <Document info={active} deleteDocument={() => {}} multiSelection={false} selectedDocuments={() => {}} editDocument={() => {}} />;
}
