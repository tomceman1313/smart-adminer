import { createSlice } from "@reduxjs/toolkit";

export const authKey = createSlice({
	name: "auth",
	initialState: {
		apiKey: null,
	},
	reducers: {
		setKey: (state, action) => {
			state.apiKey = action.payload;
		},
		deleteKey: (state) => {
			state.apiKey = null;
		},
	},
});

export const { setKey, deleteKey } = authKey.actions;

export default authKey.reducer;

/**
 * * 	const apiKey = useSelector((state) => state.auth.apiKey);
 **		const dispatch = useDispatch();
 */

//? importy
//		import { useSelector, useDispatch } from "react-redux";
//		import { setKey } from "../redux/authKey";

//* Inicializace
//		const apiKey = useSelector((state) => state.auth.apiKey);
//		const dispatch = useDispatch();

//! Přístup
//		dispatch(setKey(data.token));
//		dispatch(deleteKey());
