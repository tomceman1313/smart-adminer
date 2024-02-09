import Documents from "../documents/Documents";
import Gallery from "../gallery/Gallery";
import Notifications from "../notifications/Notifications";
import Page from "../page/Page";
import Pages from "../pages/Pages";
import Pricelist from "../pricelist/Pricelist";
import Products from "../products/Products";
import Product from "../product/Product";
import Profiles from "../profiles/Profiles";
import Roles from "../roles/Roles";
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
		class: "users",
		path: "users",
		element: <Profiles />,
		allowedRoles: [],
	},
	{
		name: "roles",
		class: "users",
		path: "roles",
		element: <Roles />,
		allowedRoles: [],
	},
	{
		name: "pages",
		class: "pages",
		path: "pages",
		element: <Pages />,
		allowedRoles: [],
	},
	{
		name: "page",
		class: "pages",
		path: "page/:name",
		element: <Page />,
		allowedRoles: [],
	},
	{
		name: "gallery",
		class: "gallery",
		path: "gallery",
		element: <Gallery />,
		allowedRoles: [],
	},
	{
		name: "gallery-page",
		class: "gallery",
		path: "gallery/:page",
		element: <Gallery />,
		allowedRoles: [],
	},
	{
		name: "documents",
		class: "documents",
		path: "documents",
		element: <Documents />,
		allowedRoles: [],
	},
	{
		name: "pricelist",
		class: "pricelist",
		path: "pricelist",
		element: <Pricelist />,
		allowedRoles: [],
	},
	{
		name: "notifications",
		class: "notifications",
		path: "notifications",
		element: <Notifications />,
		allowedRoles: [],
	},
	{
		name: "products",
		class: "products",
		path: "products",
		element: <Products />,
		allowedRoles: [],
	},
	{
		name: "new-product",
		class: "products",
		path: "new-product",
		element: <Product />,
		allowedRoles: [],
	},
	{
		name: "product-id",
		class: "products",
		path: "product/:id",
		element: <Product />,
		allowedRoles: [],
	},
	{
		name: "orders",
		class: "orders",
		path: "orders",
		element: <Orders />,
		allowedRoles: [],
	},
	{
		name: "vacancies",
		class: "vacancies",
		path: "vacancies",
		element: <Vacancies />,
		allowedRoles: [],
	},
	{
		name: "vacancy",
		class: "vacancy",
		path: "vacancy",
		element: <Vacancy />,
		allowedRoles: [],
	},
	{
		name: "vacancy-id",
		class: "vacancy",
		path: "vacancy/:id",
		element: <Vacancy />,
		allowedRoles: [],
	},
	{
		name: "employees",
		class: "employees",
		path: "employees",
		element: <Employees />,
		allowedRoles: [],
	},
	{
		name: "profile",
		class: "users",
		path: "profile",
		element: <Profile />,
		allowedRoles: [],
	},
	{
		name: "articles",
		class: "articles",
		path: "articles",
		element: <Articles />,
		allowedRoles: [],
	},
	{
		name: "new-article",
		class: "articles",
		path: "new-article",
		element: <Article />,
		allowedRoles: [],
	},
	{
		name: "article-id",
		class: "articles",
		path: "article/:id",
		element: <Article />,
		allowedRoles: [],
	},
	{
		name: "events",
		class: "events",
		path: "events",
		element: <Events />,
		allowedRoles: [],
	},
	{
		name: "new-event",
		class: "events",
		path: "new-event",
		element: <Event />,
		allowedRoles: [],
	},
	{
		name: "event-id",
		class: "events",
		path: "event/:id",
		element: <Event />,
		allowedRoles: [],
	},
];
