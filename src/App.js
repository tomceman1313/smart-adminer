import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Pages/context/AuthContext";

import Login from "./Pages/Login";
import Dashboard from "./Pages/admin/dashboard/Dashboard";
import { InteractionProvider } from "./Pages/context/InteractionContext";

function App() {
	return (
		<div className="App">
			<AuthProvider>
				<InteractionProvider>
					<BrowserRouter basename="/admin">
						<Routes>
							<Route path="/*" element={<Dashboard />} />
							<Route path="/login" element={<Login />} />
						</Routes>
					</BrowserRouter>
				</InteractionProvider>
			</AuthProvider>
		</div>
	);
}

export default App;
