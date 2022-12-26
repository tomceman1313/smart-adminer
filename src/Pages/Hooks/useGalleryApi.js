import { getAll, edit, create, remove } from "../modules/ApiFunctions";

const useGalleryApi = (action) => {
	switch (action) {
		case "getall":
			return getAll;
		case "edit":
			return edit;
		case "create":
			return create;
		case "remove":
			return remove;
		default:
			return null;
	}
};

export default useGalleryApi;
