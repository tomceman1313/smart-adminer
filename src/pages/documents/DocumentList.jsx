import { AnimatePresence } from "framer-motion";
import { DragHandle } from "../../components/common/sortable/DragHandle";
import SortableItem from "../../components/common/sortable/SortableItem";
import SortableList from "../../components/common/sortable/SortableList";
import useInteraction from "../../hooks/useInteraction";
import Document from "./Document";
import documentCss from "./css/Document.module.css";
import css from "./css/Documents.module.css";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation("documents");
	const { setAlert } = useInteraction();

	function deleteDocument(e) {
		setAlert({ id: e.target.parentNode.id, question: t("alertDeleteDocument"), positiveHandler: deleteDocumentHandler });
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
								<h3 style={{ textAlign: "center" }}>{t("noDataFound")}</h3>
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
