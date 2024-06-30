import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";
import {
	RouterProvider,
	createBrowserRouter,
	ScrollRestoration,
} from "react-router-dom";
import { ROUTES_ROUTER } from "./components/menu/routes";
import { AuthProvider } from "./context/AuthContext";
import { ImageEditorProvider } from "./context/ImageEditorContext";
import { InteractionProvider } from "./context/InteractionContext";
import Dashboard from "./pages/dashboard/Dashboard";
import ErrorPage from "./pages/error/ErrorPage";
import Login from "./pages/login/Login";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			gcTime: 0,
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

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Dashboard />,
			children: ROUTES_ROUTER,
			errorElement: <ErrorPage errorCode={404} />,
		},
		{
			path: "login",
			element: <Login />,
		},
		{
			path: "503",
			element: <ErrorPage />,
		},
	],
	{ basename: "/admin" }
);

function App() {
	return (
		<div className="App">
			<QueryClientProvider client={queryClient}>
				<HelmetProvider>
					<AuthProvider>
						<InteractionProvider>
							<ImageEditorProvider>
								<RouterProvider router={router} />
								<Toaster
									position="top-center"
									toastOptions={{
										success: { iconTheme: { primary: "#17a589" } },
										error: { iconTheme: { primary: "#d3384b" } },
									}}
								/>
							</ImageEditorProvider>
						</InteractionProvider>
					</AuthProvider>
				</HelmetProvider>
			</QueryClientProvider>
		</div>
	);
}

export default App;
