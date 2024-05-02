import Article from "../../pages/article/Article";
import Articles from "../../pages/articles/Articles";
import DocumentsPage from "../../pages/documents/DocumentsPage";
import Employees from "../../pages/employees/Employees";
import Event from "../../pages/events/Event";
import Events from "../../pages/events/Events";
import GalleryPage from "../../pages/gallery/GalleryPage";
import Notifications from "../../pages/notifications/Notifications";
import Orders from "../../pages/orders/Orders";
import Page from "../../pages/page/Page";
import Pages from "../../pages/pages/Pages";
import Pricelist from "../../pages/pricelist/Pricelist";
import Product from "../../pages/product/Product";
import Products from "../../pages/products/Products";
import Profile from "../../pages/profile/Profile";
import Profiles from "../../pages/profiles/Profiles";
import Roles from "../../pages/roles/Roles";
import SettingsPage from "../../pages/settings/SettingsPage";
import Vacancies from "../../pages/vacancies/Vacancies";
import Vacancy from "../../pages/vacancy/Vacancy";
import DashboardContent from "../../pages/dashboard/DashboardContent";

export const ROUTES = [
	{
		name: "dashboard",
		class: "stats",
		path: "/",
		element: <DashboardContent />,
		menuSection: "",
	},
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
		path: "articles/:id",
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
		path: "events/:id",
		element: <Event />,
		menuSection: "events-section",
	},
	{
		name: "settings",
		class: "settings",
		path: "settings",
		element: <SettingsPage />,
		menuSection: "settings-section",
	},
];
