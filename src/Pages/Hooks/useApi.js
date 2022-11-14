import { getAll, get, create, edit, remove, refreshAccessToken } from "../modules/ApiFunctions";

const useApi = (action) => {
	switch (action) {
		case "getAll":
			return getAll;
		case "get":
			return get;
		case "create":
			return create;
		case "edit":
			return edit;
		case "remove":
			return remove;
		case "refresh":
			return refreshAccessToken;
	}
};

export default useApi;
