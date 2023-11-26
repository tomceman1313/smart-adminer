import { useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import css from "../styles/Alert.module.css";
import useInteraction from "../../Hooks/useInteraction";

/**
 * ? message = { text, action }
 *
 * @returns ReactElement
 */
const Message = () => {
	const { message, setMessage } = useInteraction();

	useEffect(() => {
		if (message) {
			setTimeout(() => {
				setMessage(null);
			}, 6000);
		}
	}, [message, setMessage]);

	const chooseDesign = () => {
		switch (message.action) {
			case "success":
				return css.success;
			case "failure":
				return css.failure;
			case "alert":
				return css.alert;
			default:
				return css.success;
		}
	};

	const chooseIcon = () => {
		switch (message.action) {
			case "success":
				return faCircleCheck;
			case "failure":
				return faCircleXmark;
			case "alert":
				return faCircleExclamation;
			default:
				return faCircleCheck;
		}
	};

	return (
		<AnimatePresence>
			{message && (
				<motion.div className={`${css.notifier} ${chooseDesign()}`}>
					<FontAwesomeIcon icon={chooseIcon()} />
					<label>{`${message.text}`}</label>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Message;
