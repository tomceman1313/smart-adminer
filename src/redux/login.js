import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
	name: "login",
	initialState: {
		isLogged: false,
		userInfo: {},
	},
	reducers: {
		logIn: (state) => {
			state.isLogged = true;
		},
		logOut: (state) => {
			state.isLogged = false;
		},
		setUserInfo: (state, action) => {
			state.userInfo = action.payload;
		},
	},
});

export const { logIn, logOut, setUserInfo } = loginSlice.actions;

export default loginSlice.reducer;
