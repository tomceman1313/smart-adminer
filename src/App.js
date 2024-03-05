import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Pages/context/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import Login from "./Pages/Login";
import Dashboard from "./Pages/admin/dashboard/Dashboard";
import { InteractionProvider } from "./Pages/context/InteractionContext";
import { ImageEditorProvider } from "./Pages/context/ImageEditorContext";
///demo/sulicka
function App() {
	return (
		<div className="App">
			<HelmetProvider>
				<AuthProvider>
					<InteractionProvider>
						<ImageEditorProvider>
							<BrowserRouter basename="/admin">
								<Routes>
									<Route path="/*" element={<Dashboard />} />
									<Route path="/login" element={<Login />} />
								</Routes>
							</BrowserRouter>
						</ImageEditorProvider>
					</InteractionProvider>
				</AuthProvider>
			</HelmetProvider>
		</div>
	);
}

export default App;
