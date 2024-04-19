import Article from "../article/Article";
import Articles from "../articles/Articles";
import DocumentsPage from "../documents/DocumentsPage";
import Employees from "../employees/Employees";
import Event from "../events/Event";
import Events from "../events/Events";
import GalleryPage from "../gallery/GalleryPage";
import Notifications from "../notifications/Notifications";
import Orders from "../orders/Orders";
import Page from "../page/Page";
import Pages from "../pages/Pages";
import Pricelist from "../pricelist/Pricelist";
import Product from "../product/Product";
import Products from "../products/Products";
import Profile from "../profile/Profile";
import Profiles from "../profiles/Profiles";
import Roles from "../roles/Roles";
import Vacancies from "../vacancies/Vacancies";
import Vacancy from "../vacancy/Vacancy";

export const ROUTES = [
	{
		name: "users",
		class: "users",
		path: "users",
		element: <Profiles />,
		menuSection: "profiles",
	},
	{
		name: "roles",
		class: "users",
		path: "roles",
		element: <Roles />,
		menuSection: "profiles",
	},
	{
		name: "pages",
		class: "pages",
		path: "pages",
		element: <Pages />,
		menuSection: "content",
	},
	{
		name: "page",
		class: "pages",
		path: "page/:name",
		element: <Page />,
		menuSection: "content",
	},
	{
		name: "gallery",
		class: "gallery",
		path: "gallery",
		element: <GalleryPage />,
		menuSection: "content",
	},
	{
		name: "gallery-page",
		class: "gallery",
		path: "gallery/:page",
		element: <GalleryPage />,
		menuSection: "content",
	},
	{
		name: "documents",
		class: "documents",
		path: "documents",
		element: <DocumentsPage />,
		menuSection: "content",
	},
	{
		name: "pricelist",
		class: "pricelist",
		path: "pricelist",
		element: <Pricelist />,
		menuSection: "content",
	},
	{
		name: "notifications",
		class: "notifications",
		path: "notifications",
		element: <Notifications />,
		menuSection: "content",
	},
	{
		name: "products",
		class: "products",
		path: "products",
		element: <Products />,
		menuSection: "products-section",
	},
	{
		name: "new-product",
		class: "products",
		path: "new-product",
		element: <Product />,
		menuSection: "products-section",
	},
	{
		name: "product",
		class: "products",
		path: "product/:id",
		element: <Product />,
		menuSection: "products-section",
	},
	{
		name: "orders",
		class: "orders",
		path: "orders",
		element: <Orders />,
		menuSection: "orders-section",
	},
	{
		name: "vacancies",
		class: "vacancies",
		path: "vacancies",
		element: <Vacancies />,
		menuSection: "employees-section",
	},
	{
		name: "new-vacancy",
		class: "vacancies",
		path: "vacancy",
		element: <Vacancy />,
		menuSection: "employees-section",
	},
	{
		name: "vacancy",
		class: "vacancies",
		path: "vacancy/:id",
		element: <Vacancy />,
		menuSection: "employees-section",
	},
	{
		name: "employees",
		class: "employees",
		path: "employees",
		element: <Employees />,
		menuSection: "employees-section",
	},
	{
		name: "profile",
		class: "users",
		path: "profile",
		element: <Profile />,
		menuSection: "settings-section",
	},
	{
		name: "articles",
		class: "articles",
		path: "articles",
		element: <Articles />,
		menuSection: "articles-section",
	},
	{
		name: "new-article",
		class: "articles",
		path: "new-article",
		element: <Article />,
		menuSection: "articles-section",
	},
	{
		name: "article",
		class: "articles",
		path: "article/:id",
		element: <Article />,
		menuSection: "articles-section",
	},
	{
		name: "events",
		class: "events",
		path: "events",
		element: <Events />,
		menuSection: "events-section",
	},
	{
		name: "new-event",
		class: "events",
		path: "new-event",
		element: <Event />,
		menuSection: "events-section",
	},
	{
		name: "event",
		class: "events",
		path: "event/:id",
		element: <Event />,
		menuSection: "events-section",
	},
];
