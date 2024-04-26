import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import css from "../styles/CheckMessage.module.css";
import useInteraction from "../../hooks/useInteraction";
import { useTranslation } from "react-i18next";

/**
 * ? alert = { id, question, positiveHandler }
 * @returns ReactElement
 */
const Alert = () => {
	const { t } = useTranslation("common");
	const { alert, setAlert } = useInteraction();
	const hideCheckMessage = () => {
		setAlert(false);
	};

	return (
		<AnimatePresence>
			{alert && (
				<motion.div
					className={css.check_message}
					initial={{ y: -300, x: "-50%" }}
					animate={{ y: 50 }}
					exit={{ y: -300 }}
					transition={{ type: "spring", duration: 1 }}
				>
					<p>{alert.question}</p>
					<button
						onClick={() => {
							alert.positiveHandler(alert.id);
							setAlert(false);
						}}
					>
						{t("buttonConfirm")}
					</button>
					<button onClick={hideCheckMessage}>{t("buttonCancel")}</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Alert;
