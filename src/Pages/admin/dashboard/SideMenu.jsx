import useViewport from "../../Hooks/useViewport";
import DesktopMenu from "./desktop-menu/DesktopMenu";
import MobileMenu from "./mobile-menu/MobileMenu";
import { logOut } from "../../modules/ApiFunctions";

export default function SideMenu({ auth }) {
	const { width } = useViewport();

	return width > 1600 ? <DesktopMenu logOut={() => logOut(auth)} /> : <MobileMenu logOut={() => logOut(auth)} />;
}
