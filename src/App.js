import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/admin/users/Register";
import Dashboard from "./Pages/admin/dashboard/Dashboard";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
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
