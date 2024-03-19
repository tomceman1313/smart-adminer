import { faEye, faFile, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { openImage, publicPath } from "../../../modules/BasicFunctions";
import css from "./FileInput.module.css";

export default function FileInput({ name, register, fileName, additionalClasses, required = true, title }) {
	const [isFileSet, setIsFileSet] = useState(fileName ? true : false);

	let divClassName = `${css.input_box}`;
	if (additionalClasses) {
		if (additionalClasses.includes("half")) {
			divClassName += ` ${css.half}`;
		}
	}

	useEffect(() => {
		fileName ? setIsFileSet(true) : setIsFileSet(false);
	}, [fileName]);

	return (
		<div className={divClassName} title={title}>
			{isFileSet ? (
				<div className={css.file_box}>
					<span onClick={() => openImage(`${publicPath}/files/documents/${fileName}`)} title="Otevřít soubor">
						<FontAwesomeIcon icon={faEye} />
					</span>
					<span onClick={() => setIsFileSet(false)} title="Změnit soubor">
						<FontAwesomeIcon icon={faRotate} />
					</span>
				</div>
			) : (
				<input type="file" {...register(name)} accept="*" required={required} />
			)}
			<FontAwesomeIcon className={css.icon} icon={faFile} />
		</div>
	);
}
