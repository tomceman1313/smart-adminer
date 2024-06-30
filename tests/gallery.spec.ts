import { test, expect } from "../playwright/fixtures";

test("Create category", async ({ page: screen }) => {
	await screen.goto("/admin/gallery");
	await screen
		.getByPlaceholder("Název kategorie")
		.fill("--E2E testing category--");

	await screen.waitForTimeout(1000);
	await screen.getByRole("button", { name: "Vytvořit" }).click();

	await screen.waitForTimeout(1000);
	await expect(
		screen.locator('input[value="--E2E testing category--"]')
	).toHaveCount(1);
});

test("Update category", async ({ page: screen }) => {
	await screen.goto("/admin/gallery");

	//set new value
	await screen.locator("li svg:nth-child(3)").first().click();
	await screen.locator("input").first().fill("--E2E testing--");
	await screen.locator("svg:nth-child(3) > path").first().click();

	//wait for stale data
	await screen.waitForTimeout(1000);
	await expect(screen.locator('input[value="--E2E testing--"]')).toHaveCount(1);
});

test("Add new image", async ({ page: screen }) => {
	await screen.goto("/admin/gallery");

	await screen.getByPlaceholder("Název obrázku").fill("Test image");
	await screen.getByPlaceholder("Popisek").fill("Image description");
	await screen
		.locator("ul")
		.filter({ hasText: "-- Přiřadit kategorii --" })
		.click();
	await screen.getByText("--E2E testing--").click();
	await screen
		.locator('input[name="image"]')
		.setInputFiles("public/login_background.jpeg");
	await screen.getByRole("button", { name: "Vložit", exact: true }).click();

	await expect(screen.getByRole("img", { name: "Test image" })).toBeVisible();
});

test("Filter by category", async ({ page: screen }) => {
	await screen.goto("/admin/gallery");
	await screen.waitForLoadState("domcontentloaded");
	await screen.locator("li svg:nth-child(2)").first().click();

	//wait for stale data
	await screen.waitForTimeout(1000);
	await expect(screen.locator("section div img")).toHaveCount(1);
});

test("Update image", async ({ page: screen }) => {
	await screen.goto("/admin/gallery");

	await screen.getByRole("img", { name: "Test image" }).click();
	await screen.locator("article svg").nth(1).click();

	await screen
		.locator("form")
		.filter({ hasText: "--E2E testing--" })
		.getByPlaceholder("Název obrázku")
		.fill("Test image update");

	await screen
		.locator("form")
		.filter({ hasText: "--E2E testing--" })
		.getByPlaceholder("Popisek")
		.fill("Image description update");
	await screen
		.locator("li")
		.filter({ hasText: "--E2E testing--" })
		.locator("svg")
		.click();
	await screen.getByRole("button", { name: "Uložit" }).click();

	//wait for stale data
	await screen.waitForTimeout(1000);

	await expect(
		screen.getByRole("img", { name: "Test image update" })
	).toBeVisible();
});

test("Delete image", async ({ page: screen }) => {
	await screen.goto("/admin/gallery");
	await screen.getByRole("img", { name: "Test image update" }).click();
	await screen.locator("article svg").first().click();
	await screen.getByRole("button", { name: "Potvrdit" }).click();

	//wait for stale data
	await screen.waitForTimeout(1000);
	await screen.locator("li svg:nth-child(2)").first().click();
	expect(await screen.locator("section div img").count()).toBe(0);
});

test("Create multiple images", async ({ page: screen }) => {
	await screen.goto("/admin/gallery");
	await screen.getByRole("button", { name: "Vložit více" }).click();

	await screen
		.locator("section")
		.filter({ hasText: "Přidání obrázků-- Přiřadit" })
		.getByRole("list")
		.click();
	await screen.getByText("--E2E testing--").click();

	await screen
		.locator('input[name="images"]')
		.setInputFiles(["public/login_background.jpeg", "public/logo.png"]);

	await screen
		.locator("form")
		.filter({ hasText: "--E2E testing--Vložit" })
		.getByRole("button")
		.click();

	await screen.waitForTimeout(1000);
	await screen.locator("li svg:nth-child(2)").first().click();

	await expect(screen.locator("ul div img")).toHaveCount(2);
});

test("Delete multiple images", async ({ page: screen }) => {
	await screen.goto("/admin/gallery");
	await screen.waitForLoadState("domcontentloaded");
	await screen.locator("li svg:nth-child(2)").first().click();

	await screen.getByRole("button", { name: "Výběr více položek" }).click();
	await screen.waitForTimeout(1000);
	await screen.locator("ul div:nth-child(1)").click();
	await screen.locator("ul div:nth-child(2)").click();
	await screen.getByRole("button", { name: "Odstranit vybrané" }).click();
	await screen.getByRole("button", { name: "Potvrdit" }).click();

	await expect(screen.locator("ul div img")).toHaveCount(0);
});

test("Delete category", async ({ page: screen }) => {
	await screen.goto("/admin/gallery");

	//delete category
	await screen.locator("li svg:nth-child(4)").first().click();
	await screen.getByRole("button", { name: "Potvrdit" }).click();

	//wait for stale data
	await screen.waitForTimeout(1000);

	expect(
		await screen.locator('input[value="--E2E testing category--"]').count()
	).toBe(0);
});
