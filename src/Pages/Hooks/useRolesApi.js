import { getRoles, editRole } from "../modules/ApiFunctions";

const useRolesApi = (action) => {
	switch (action) {
		case "getroles":
			return getRoles;
		case "update_role":
			return editRole;
	}
};

export default useRolesApi;
