import { convertBase64, makeDateFormat } from "../../modules/BasicFunctions";
import {
	findDeletedImages,
	formatBody,
	removeEmptyParagraphs,
} from "../../modules/TextEditorFunctions";
import i18next from "i18next";
import warningToast from "../../components/common/warning-toast/WarningToast";

export async function formatSubmittedData(
	data,
	article,
	body,
	originalImages,
	apiClass
) {
	let arrayInsideImages = [];
	data.date = makeDateFormat(data.date);
	data.body = await formatBody(body, arrayInsideImages, apiClass);

	if (data.body === "") {
		warningToast(i18next.t(`${apiClass}:messageEmptyArticleBody`));
		return null;
	}

	data.active = data.active ? 1 : 0;
	if (data.image?.[0]) {
		const base64 = await convertBase64(data.image[0]);
		data.image = base64;
		if (article) {
			data.prevImage = article.image;
		}
	} else {
		data.image = "no-change";
	}

	let imagesArray = [];
	for (const file of data.images) {
		const base64 = await convertBase64(file);
		imagesArray.push(base64);
	}
	data.images = imagesArray;
	data.innerImages = arrayInsideImages;
	data.deletedImages = findDeletedImages(body, originalImages);

	return data;
}

export async function formatArticlePreviewData(data, article, body) {
	data.date = makeDateFormat(data.date);
	if (data.image?.[0]) {
		const base64 = await convertBase64(data.image[0]);
		data.image = base64;
	} else {
		data.image = article ? article.image : null;
	}

	let imagesArray = [];
	for (const file of data.images) {
		const base64 = await convertBase64(file);
		imagesArray.push(base64);
	}
	data.images = article ? article.images.concat(imagesArray) : imagesArray;
	data.body = removeEmptyParagraphs(body);
	return data;
}
