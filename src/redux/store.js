import { configureStore } from "@reduxjs/toolkit";
import login from "./login";
import counterReducer from "./slicer";
import authKey from "./authKey";

export default configureStore({
	reducer: {
		counter: counterReducer,
		user: login,
		auth: authKey,
	},
});
