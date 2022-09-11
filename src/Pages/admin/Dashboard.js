import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import css from "./styles/Dashboard.module.css";
import SideMenu from "../Components/admin/SideMenu";
import Register from "./Register";
import Profiles from "./Profiles";
import Pricelist from "./Pricelist";

import { useSelector, useDispatch } from "react-redux";
import { deleteKey } from "../../redux/authKey";

export default function Dashboard() {
	const apiKey = useSelector((state) => state.auth.apiKey);
	let navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		// if (apiKey == null) {
		// 	navigate("/login");
		// }
	}, [apiKey]);

	const logOut = () => {
		dispatch(deleteKey());
	};

	return (
		<div className={css.dashboard}>
			<SideMenu logOut={logOut} />
			<div className={css.banner}>
				<h1>Ceník</h1>
				<p>Úprava cen, tvorba nových položek, spouštění akčních cen</p>
			</div>
			<div className={css.content}>
				<Routes>
					<Route path="users" element={<Profiles />} />
					<Route path="register" element={<Register />} />
					<Route path="pricelist" element={<Pricelist />} />
				</Routes>
			</div>
		</div>
	);
}
