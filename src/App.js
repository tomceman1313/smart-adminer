import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { InteractionProvider } from "./context/InteractionContext";
import { ImageEditorProvider } from "./context/ImageEditorContext";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	return (
		<div className="App">
			<QueryClientProvider client={queryClient}>
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
			</QueryClientProvider>
		</div>
	);
}

export default App;
