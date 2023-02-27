import { Link } from "react-router-dom";

import css from "./styles/Home.module.css";

function Home() {
	const getdata = async () => {
		const response = await fetch(`https://smart-studio.fun/api?class=admin&action=getall`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			credentials: "include",
		});
		const data = await response.json();
		console.log(data);
	};

	getdata();

	return (
		<div className={css.login}>
			<nav>
				<Link to="/">Home</Link>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
				<Link to="/dashboard">Register</Link>
			</nav>
			<h1>Home</h1>
		</div>
	);
}

export default Home;
