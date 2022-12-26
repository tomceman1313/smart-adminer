import useViewport from "../../Hooks/useViewport";
import DesktopMenu from "./desktop-menu/DesktopMenu";
import MobileMenu from "./mobile-menu/MobileMenu";

export default function SideMenu({ logOut }) {
	const { width } = useViewport();

	return width > 1600 ? <DesktopMenu logOut={logOut} /> : <MobileMenu logOut={logOut} />;
}
