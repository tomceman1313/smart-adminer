import { test, expect } from "../playwright/fixtures";

test("Create category", async ({ page: screen }) => {
	await screen.goto("/admin/articles");
	await screen.getByPlaceholder("Název kategorie").click();
	await screen
		.getByPlaceholder("Název kategorie")
		.fill("--E2E testing category--");

	await screen.getByRole("button", { name: "Vytvořit" }).click();

	await screen.waitForTimeout(1000);
	await expect(
		screen.locator('input[value="--E2E testing category--"]')
	).toHaveCount(1);
});

test("Update category", async ({ page: screen }) => {
	await screen.goto("/admin/articles");

	//set new value
	await screen.locator("svg:nth-child(3)").first().click();
	await screen.getByRole("textbox").first().fill("--E2E testing--");
	await screen.locator("svg:nth-child(3)").first().click();

	//wait for stale data
	await screen.waitForTimeout(1000);
	await expect(screen.locator('input[value="--E2E testing--"]')).toHaveCount(1);
});

test("Create new article", async ({ page: screen }) => {
	await screen.goto("/admin/new-article");
	await screen.getByPlaceholder("Titulek").click();
	await screen.getByPlaceholder("Titulek").fill("E2E testing title");
	await screen.getByPlaceholder("Titulek").press("Tab");
	await screen.getByPlaceholder("Popisek").fill("E2E testing description");

	await screen.locator('input[name="date"]').fill("2024-05-29");
	await screen
		.locator("div")
		.filter({ hasText: /^-- Kategorie článku --$/ })
		.nth(1)
		.click();
	await screen.getByRole("list").getByText("--E2E testing--").click();
	await screen
		.locator('input[name="image"]')
		.setInputFiles("public/login_background.jpeg");

	await screen
		.locator("section")
		.filter({ hasText: "Text článku Obrázky pod člá" })
		.getByRole("paragraph")
		.click();
	await screen.locator(".ql-editor").fill("E2E testing");
	await screen.waitForTimeout(1500);
	await screen.getByRole("button", { name: "Vytvořit" }).click();

	await expect(
		screen.getByRole("heading", { name: "E2E testing title" })
	).toBeVisible();
});

test("Get all articles", async ({ page: screen }) => {
	await screen.goto("/admin/articles");
	await expect(
		screen.getByRole("heading", { name: "E2E testing title" })
	).toBeVisible();
});

test("Show article", async ({ page: screen }) => {
	await screen.goto("/admin/articles");
	await screen.waitForLoadState("domcontentloaded");
	//check if filter by category works
	await screen.locator("li").first().locator("svg").first().click();
	//wait until response is processed
	await screen.waitForResponse(
		(response) =>
			response.status() === 200 &&
			!!response.url().match(/\/api\/articles\/\?category=\d*/)
	);

	// Wait for the UI to be updated
	await screen.waitForSelector("article");
	//Only testing article should be visible
	await expect(screen.locator("article")).toHaveCount(1);

	//show article
	await screen.getByRole("heading", { name: "E2E testing title" }).click();

	//title
	await expect(screen.locator('input[name="title"]')).toHaveValue(
		"E2E testing title"
	);
	//description
	await expect(screen.locator('input[name="description"]')).toHaveValue(
		"E2E testing description"
	);
	//switch
	expect(await screen.locator('input[name="active"]').isChecked()).toBeFalsy();
	//publication date
	await expect(screen.locator('input[name="date"]')).toHaveValue("2024-05-29");
	//image
	await expect(screen.getByTitle("Zobrazit obrázek")).toBeVisible();
	//body
	await expect(
		await screen.locator('div[class="ql-editor"]').innerHTML()
	).toStrictEqual("<p>E2E testing</p>");
});

test("Update article", async ({ page: screen }) => {
	await screen.goto("/admin/articles");
	await expect(
		screen.getByRole("heading", { name: "E2E testing title" })
	).toBeVisible();
	await screen.getByRole("heading", { name: "E2E testing title" }).click();

	//set updated values
	await screen.getByPlaceholder("Titulek").fill("E2E testing title update");
	await screen
		.getByPlaceholder("Popisek")
		.fill("E2E testing description update");

	await screen.getByTestId("switch").check();
	await screen.locator('input[name="date"]').fill("2024-06-03");
	await screen.getByTitle("Změnit obrázek").click();
	await screen
		.locator('input[name="image"]')
		.setInputFiles("public/login_background_test.jpg");
	await screen.locator(".ql-editor").fill("E2E testing update");
	await screen.waitForTimeout(1500);
	await screen.getByRole("button", { name: "Uložit" }).click();

	//refresh
	await screen.reload();

	//check new values
	//title
	await expect(screen.locator('input[name="title"]')).toHaveValue(
		"E2E testing title update"
	);
	//description
	await expect(screen.locator('input[name="description"]')).toHaveValue(
		"E2E testing description update"
	);
	//image
	await expect(screen.getByTitle("Zobrazit obrázek")).toBeVisible();
	//switch
	expect(await screen.locator('input[name="active"]').isChecked()).toBeTruthy();
	//date
	await expect(screen.locator('input[name="date"]')).toHaveValue("2024-06-03");
	//body
	await expect(
		await screen.locator('div[class="ql-editor"]').innerHTML()
	).toStrictEqual("<p>E2E testing update</p>");
});

test("Delete article", async ({ page: screen }) => {
	await screen.goto("/admin/articles");
	await expect(
		screen.getByRole("heading", { name: "E2E testing title" })
	).toBeVisible();
	await screen.getByRole("heading", { name: "E2E testing title" }).click();

	//click delete button
	await screen.getByRole("button", { name: "Smazat" }).click();
	await screen.getByRole("button", { name: "Potvrdit" }).click();
});

test("Delete category", async ({ page: screen }) => {
	await screen.goto("/admin/articles");

	//delete category
	await screen.locator("svg:nth-child(4)").first().click();
	await screen.getByRole("button", { name: "Potvrdit" }).click();

	//wait for stale data
	await screen.waitForTimeout(1000);
	await expect(screen.locator('input[value="--E2E testing--"]')).toHaveCount(0);
});
