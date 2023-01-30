import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Pages/context/AuthContext";

import Dashboard from "./Pages/admin/dashboard/Dashboard";
import Register from "./Pages/admin/register/Register";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { InteractionProvider } from "./Pages/context/InteractionContext";

function App() {
	return (
		<div className="App">
			<AuthProvider>
				<InteractionProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/dashboard/*" element={<Dashboard />} />
						</Routes>
					</BrowserRouter>
				</InteractionProvider>
			</AuthProvider>
		</div>
	);
}

export default App;
