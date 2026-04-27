import { test, expect } from "@playwright/test";

test("Amazon Laptop Search and Handle New Tab", async ({ page, context }) => {

  // Open Amazon
  await page.goto("https://www.amazon.in/");

  // Search laptop
  await page.locator('[name="field-keywords"]').fill("laptop");
  await page.keyboard.press("Enter");

  // Wait and click product (opens new tab)
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByText("M3407KA-SF049WS").click()
  ]);

  // Wait for new tab to load
  await page.waitForTimeout(5000)

  // Do something in new tab (example)
  console.log("New tab opened");
  await newPage.waitForTimeout(3000);

  // Close new tab
  await newPage.close();
  console.log("New tab closed");

  // Back to old page (search results page)
  await page.bringToFront();

  // Verify we are back
  await expect(page).toHaveURL(/amazon/);

  console.log("Returned to main page successfully");

});