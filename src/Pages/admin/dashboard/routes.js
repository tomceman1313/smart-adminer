import Documents from "../documents/Documents";
import Gallery from "../gallery/Gallery";
import Notifications from "../notifications/Notifications";
import Page from "../page/Page";
import Pages from "../pages/Pages";
import Pricelist from "../pricelist/Pricelist";
import Products from "../products/Products";
import Product from "../product/Product";
import Profiles from "../profiles/Profiles";
import Register from "../register/Register";
import Orders from "../orders/Orders";
import Vacancies from "../vacancies/Vacancies";
import Vacancy from "../vacancy/Vacancy";
import Employees from "../employees/Employees";
import Profile from "../profile/Profile";
import Articles from "../articles/Articles";
import Article from "../article/Article";
import Event from "../events/Event";
import Events from "../events/Events";

export const ROUTES = [
	{
		name: "users",
		path: "users",
		element: <Profiles />,
		allowedRoles: [],
	},
	{
		name: "register",
		path: "register",
		element: <Register />,
		allowedRoles: [],
	},
	{
		name: "pages",
		path: "pages",
		element: <Pages />,
		allowedRoles: [],
	},
	{
		name: "page",
		path: "page/:name",
		element: <Page />,
		allowedRoles: [],
	},
	{
		name: "gallery",
		path: "gallery",
		element: <Gallery />,
		allowedRoles: [],
	},
	{
		name: "gallery-page",
		path: "gallery/:page",
		element: <Gallery />,
		allowedRoles: [],
	},
	{
		name: "documents",
		path: "documents",
		element: <Documents />,
		allowedRoles: [],
	},
	{
		name: "pricelist",
		path: "pricelist",
		element: <Pricelist />,
		allowedRoles: [],
	},
	{
		name: "notifications",
		path: "notifications",
		element: <Notifications />,
		allowedRoles: [],
	},
	{
		name: "products",
		path: "products",
		element: <Products />,
		allowedRoles: [],
	},
	{
		name: "new-product",
		path: "new-product",
		element: <Product />,
		allowedRoles: [],
	},
	{
		name: "product-id",
		path: "product/:id",
		element: <Product />,
		allowedRoles: [],
	},
	{
		name: "orders",
		path: "orders",
		element: <Orders />,
		allowedRoles: [],
	},
	{
		name: "vacancies",
		path: "vacancies",
		element: <Vacancies />,
		allowedRoles: [],
	},
	{
		name: "vacancy",
		path: "vacancy",
		element: <Vacancy />,
		allowedRoles: [],
	},
	{
		name: "vacancy-id",
		path: "vacancy/:id",
		element: <Vacancy />,
		allowedRoles: [],
	},
	{
		name: "employees",
		path: "employees",
		element: <Employees />,
		allowedRoles: [],
	},
	{
		name: "profile",
		path: "profile",
		element: <Profile />,
		allowedRoles: [],
	},
	{
		name: "articles",
		path: "articles",
		element: <Articles />,
		allowedRoles: [],
	},
	{
		name: "new-article",
		path: "new-article",
		element: <Article />,
		allowedRoles: [],
	},
	{
		name: "article-id",
		path: "article/:id",
		element: <Article />,
		allowedRoles: [],
	},
	{
		name: "events",
		path: "events",
		element: <Events />,
		allowedRoles: [],
	},
	{
		name: "new-event",
		path: "new-event",
		element: <Event />,
		allowedRoles: [],
	},
	{
		name: "event-id",
		path: "event/:id",
		element: <Event />,
		allowedRoles: [],
	},
];
