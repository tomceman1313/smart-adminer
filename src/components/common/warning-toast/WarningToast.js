import toast from "react-hot-toast";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function warningToast(message) {
	toast(message, {
		icon: (
			<FontAwesomeIcon
				style={{ color: "#fd7e14" }}
				icon={faTriangleExclamation}
			/>
		),
	});
}
