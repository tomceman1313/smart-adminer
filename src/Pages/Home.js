import { Link } from "react-router-dom";

import css from "./styles/Home.module.css";

function Home() {
	const test = async () => {
		const response = await fetch("http://localhost:4300/api/?class=admin&action=test", {
			method: "POST",
			headers: { "Content-Type": "application/json; charset=UTF-8" },
			body: JSON.stringify({ data: "token123654987" }),
			credentials: "include",
		});

		const rdata = await response.text();
		console.log(rdata);
	};

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
