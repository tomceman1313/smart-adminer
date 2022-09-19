import React, { useEffect } from "react";
import css from "./styles/Profile.module.css";

const Profile = () => {
	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Správa profilu";
		document.getElementById("banner-desc").innerHTML = "Přehled a správa uživatelského profilu";
	}, []);

	return (
		<div className={css.profile}>
			<section></section>
		</div>
	);
};

export default Profile;
