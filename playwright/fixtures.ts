import { test as baseTest, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

export * from "@playwright/test";
export const test = baseTest.extend<{}, { workerStorageState: string }>({
	// Use the same storage state for all tests in this worker.
	storageState: ({ workerStorageState }, use) => use(workerStorageState),

	// Authenticate once per worker with a worker-scoped fixture.
	workerStorageState: [
		async ({ browser }, use) => {
			// Use parallelIndex as a unique identifier for each worker.
			const id = test.info().parallelIndex;
			const fileName = path.resolve(
				test.info().project.outputDir,
				`.auth/${id}.json`
			);

			if (fs.existsSync(fileName)) {
				// Reuse existing authentication state if any.
				await use(fileName);
				return;
			}

			// Important: make sure we authenticate in a clean environment by unsetting storage state.
			const page = await browser.newPage({ storageState: undefined });

			await page.goto("http://localhost:3000/admin/login");
			await page.getByPlaceholder("Uživatelské jméno").click();
			await page.getByPlaceholder("Uživatelské jméno").fill("admin");
			await page.getByPlaceholder("Uživatelské jméno").press("Tab");
			await page.getByPlaceholder("Heslo").fill("heslo");
			await page.getByRole("button", { name: "Přihlásit" }).click();
			await page.getByPlaceholder("Heslo").click();
			await page.getByPlaceholder("Heslo").fill("Tomikz13");
			await page.getByRole("button", { name: "Přihlásit" }).click();
			await page.waitForURL("http://localhost:3000/admin");

			await expect(
				page.getByRole("heading", { name: "Přehled" })
			).toBeVisible();

			await page.context().storageState({ path: fileName });
			await page.close();
			await use(fileName);
		},
		{ scope: "worker" },
	],
});
