import React from "react";
import { Link } from "react-router-dom";

import css from "./MenuComponents.module.css";

export default function MenuLink({ title, name, path, activeLink }) {
	return (
		<Link to={path} className={activeLink === name ? css.active_link : ""}>
			{title}
		</Link>
	);
}
