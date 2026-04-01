
// const { expect } = require("@playwright/test")

// async function login(page) {
//   await page.goto("https://adminv2.nowdigitaleasy.com/login")
//   await page.locator('[name="userName"]').fill("iaaxin")
//   await page.locator('[name="password"]').fill("King_Guna")
//   await page.getByRole("button",{name:"Login"}).click()
//   await expect(page).toHaveURL(/home/)
// }

// module.exports = { login }
const {test,expect}=require("@playwright/test")

test("practice",async ({ page })=>{
   await page.goto("https://practicetestautomation.com/practice-test-login/")
await page.locator('[name="username"]').fill("student")
await page.locator('[name="password"]').fill("Password123")
await page.getByRole("button",{name:"Submit"}).click()
await expect(page).toHaveURL("https://practicetestautomation.com/logged-in-successfully/")
await page.getByRole("link",{name:"Log out"}).click()
await expect(page).toHaveURL("https://practicetestautomation.com/practice-test-login/")

})