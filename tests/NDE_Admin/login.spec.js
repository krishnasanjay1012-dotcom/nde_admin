
const { expect } = require("@playwright/test")

async function login(page) {
  await page.goto("https://adminv2.nowdigitaleasy.com/login")
  await page.locator('[name="userName"]').fill("iaaxin")
  await page.locator('[name="password"]').fill("King_Guna")
  await page.getByRole("button",{name:"Login"}).click()
  await expect(page).toHaveURL(/home/)
}

module.exports = { login }