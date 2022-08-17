import { configureStore } from "@reduxjs/toolkit";
import login from "./login";
import counterReducer from "./slicer";

export default configureStore({
	reducer: {
		counter: counterReducer,
		user: login,
	},
});
