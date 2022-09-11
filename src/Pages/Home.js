import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { decrement, increment, incrementByAmount } from "../redux/slicer";

import css from "./styles/Home.module.css";

function Home() {
	const [list, setList] = useState(null);

	const count = useSelector((state) => state.counter.value);
	const dispatch = useDispatch();

	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		fetch("http://localhost:4300/api?class=admin&action=show").then((response) => {
			response.text().then((_data) => {
				let data = JSON.parse(_data);
				console.log(data);
				setList(data);
			});
		});
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
			<div>{list && list.map((user) => <p key={user.id}>{user.username}</p>)}</div>

			<div>
				<button aria-label="Increment value" onClick={() => dispatch(increment())}>
					Increment
				</button>
				<span>{count}</span>
				<button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
					Decrement
				</button>
				<button aria-label="Decrement value" onClick={() => dispatch(incrementByAmount(33))}>
					Increment 33
				</button>
			</div>
		</div>
	);
}

export default Home;
