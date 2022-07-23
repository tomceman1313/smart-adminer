import { useState, useEffect } from "react";
import css from "./styles/Home.module.css";

function Home() {
	const [list, setList] = useState([]);
	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		fetch("http://localhost:4300/api?class=admin&action=show").then((response) => {
			response.text().then((_data) => {
				let data = JSON.parse(_data);
				console.log(data);
				setList(data.name);
			});
		});
	};

	return (
		<div className={css.login}>
			<h1>Home</h1>
			<p>{list}</p>
		</div>
	);
}

export default Home;
