import { Link } from "react-router-dom";

import css from "./styles/Home.module.css";

function Home() {
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
