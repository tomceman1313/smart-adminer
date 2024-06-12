import { test, expect } from "../playwright/fixtures";

test("logout", async ({ page: screen }) => {
	await screen.goto("/admin");
	await screen.getByTestId("toggleMenuButton").click();
	await screen.getByText("Odhlásit").click();
	await expect(screen).toHaveURL("/admin/login");
});
