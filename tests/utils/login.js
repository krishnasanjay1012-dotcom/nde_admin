
import { expect } from "@playwright/test"

export async function login(page) {
console.log("==================================================================")
// await page.goto("https://www.google.com")
// await page.locator('[name="q"]').fill("sanjay")
// await page.waitForTimeout(3000)
await page.goto("https://superadmin.nowdigitaleasy.com/login")
const username="iaaxin"
const password="King_Guna"
await page.locator('[name="userName"]').fill(username)
await page.locator('[name="password"]').fill(password)
await page.getByRole("button",{name:"Login"}).click()
await page.waitForTimeout(7000)
await expect(page).toHaveURL("https://superadmin.nowdigitaleasy.com/home")
console.log("Current URL:",await page.url())
console.log("login passed ✅")
console.log("Username :"+" "+username)
console.log("Password :"+" "+password)
console.log("==================================================================")
await page.waitForTimeout(7000)
}

