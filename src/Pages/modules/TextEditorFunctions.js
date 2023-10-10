import { publicPath } from "./BasicFunctions";

export async function formatBody(body, arrayInsideImages, location) {
	let bodyContent = body;

	let newBody = bodyContent;
	newBody = newBody.replaceAll("<p><br></p>", "");
	const regexImage = /(data:image\/(png|jpg|jpeg);base64,)(.*?)(?=["])/g;
	while (true) {
		if (newBody.match(regexImage)) {
			const replacedPart = newBody.match(regexImage);
			const fileFormat = await getImageFormat(replacedPart[0]);
			const id = parseInt(Date.now() + Math.random() * 1000);
			let imgSrc = `${publicPath}/images/${location}/innerimage${id}.${fileFormat}`;
			arrayInsideImages.push({ name: `innerimage${id}`, file: replacedPart[0] });
			newBody = newBody.replace(replacedPart[0], imgSrc);
		} else {
			return newBody;
		}
	}
}

export function removeEmptyParagraphs(body) {
	return body.replaceAll("<p><br></p>", "");
}

export function checkInnerImage(sourceString) {
	const regex = /innerimage\d*.\w*/g;
	const found = sourceString.match(regex);
	return found ? found : [];
}

export function findDeletedImages(body, originalImages) {
	const bodyImages = checkInnerImage(body);
	if (originalImages.current.length !== bodyImages.length) {
		// eslint-disable-next-line array-callback-return
		return originalImages.current.filter((el) => {
			if (!bodyImages.includes(el)) {
				return el;
			}
		});
	}
	return [];
}

const getImageFormat = async (str) => {
	const start = str.indexOf("image/") + 6;
	for (var i = start; i < 30; i++) {
		if (str[i] === ";") {
			return str.slice(start, i);
		}
	}
};
