import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import {
	QueryCache,
	MutationCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { InteractionProvider } from "./context/InteractionContext";
import { ImageEditorProvider } from "./context/ImageEditorContext";
import toast, { Toaster } from "react-hot-toast";
import ErrorPage from "./pages/error/ErrorPage";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
	queryCache: new QueryCache({
		onError: (error, query) => {
			console.log("Error description", error);
			if (query.meta?.errorMessage) {
				toast.error(query.meta.errorMessage);
			}
		},
	}),

	mutationCache: new MutationCache({
		onError: (error, variables, context, mutation) => {
			if (mutation.meta?.errorMessage) {
				toast.error(mutation.meta.errorMessage);
				toast.error(error.message.slice(0, 100));
			}
		},
	}),
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
										<Route
											path="/503"
											element={<ErrorPage errorCode={503} />}
										/>
										<Route path="*" element={<ErrorPage errorCode={404} />} />
									</Routes>
									<Toaster
										position="top-center"
										toastOptions={{
											success: { iconTheme: { primary: "#17a589" } },
											error: { iconTheme: { primary: "#d3384b" } },
										}}
									/>
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
