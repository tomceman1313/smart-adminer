import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/admin/Register";
import Dashboard from "./Pages/admin/Dashboard";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<nav>
					<Link to="/">Home</Link>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
					<Link to="/dashboard">Register</Link>
				</nav>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard/*" element={<Dashboard />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
