import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Pages/context/AuthContext";

import Dashboard from "./Pages/admin/dashboard/Dashboard";
import Register from "./Pages/admin/users/Register";
import Home from "./Pages/Home";
import Login from "./Pages/Login";

function App() {
	return (
		<div className="App">
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/dashboard/*" element={<Dashboard />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</div>
	);
}

export default App;
