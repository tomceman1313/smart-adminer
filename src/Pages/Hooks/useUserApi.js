import { getUserData, editUserData, changePassword } from "../modules/ApiFunctions";

const useUserApi = (action) => {
	switch (action) {
		case "get":
			return getUserData;
		case "edit":
			return editUserData;
		case "password":
			return changePassword;
		default:
			return getUserData;
	}
};

export default useUserApi;
