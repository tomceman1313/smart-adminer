import React from "react";
import { Routes, Route } from "react-router-dom";

import css from "./styles/Dashboard.module.css";
import SideMenu from "../Components/admin/SideMenu";
import Register from "./Register";
import Profiles from "./Profiles";

export default function Dashboard() {
	return (
		<div className={css.dashboard}>
			<SideMenu />

			<div className={css.content}>
				<Routes>
					<Route path="users" element={<Profiles />} />
					<Route path="register" element={<Register />} />
				</Routes>
			</div>
		</div>
	);
}
