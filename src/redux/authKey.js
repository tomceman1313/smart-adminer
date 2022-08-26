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
