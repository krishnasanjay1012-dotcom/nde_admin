const {test,expect}=require("@playwright/test")
const {login } = require("./login.spec.js")

test("practice",async ({ page })=>{
   await page.goto("https://practicetestautomation.com/practice-test-login/")
await page.locator('[name="username"]').fill("student")
await page.locator('[name="password"]').fill("Password123")
await page.getByRole("button",{name:"Submit"}).click()
await expect(page).toHaveURL("https://practicetestautomation.com/logged-in-successfully/")
await page.getByRole("link",{name:"Log out"}).click()
await expect(page).toHaveURL("https://practicetestautomation.com/practice-test-login/")
})