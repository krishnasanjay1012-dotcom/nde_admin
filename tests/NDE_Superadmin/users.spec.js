import { test, expect } from "@playwright/test"
import { login } from "../utils/login.js"
test.setTimeout(5 * 30 * 1000)

test("NDE Admin Customer", async ({ page }) => {
  
   await login(page)
//    await users(page)

async function users(page){
   await page.getByRole("button",{name: 'Settings', exact: true}).click()
   await page.getByRole("button",{name: 'User', exact: true}).click()
   await page.waitForTimeout(3000)

      console.log("Total users 👇")

    const usersrows = page.locator("tbody tr")

    const userscount = await usersrows.count()

    for (let i = 0; i < userscount; i++) {
        const productName = await usersrows.nth(i).locator("td").first().innerText()
        console.log(productName)
    }
    console.log(`before ${userscount} Users ✅`)
   console.log("==================================================================")

   const username="sanjay"

   await page.getByRole("button",{name: 'New User', exact: true}).click()
   await page.locator('[name="name"]').fill("sanjay")
   await page.locator('[name="username"]').fill(username)
   await page.locator('[name="email"]').fill("sanjay@gmail.com")
   await page.locator('[name="phone_number"]').fill("9876543210")
   await page.getByRole("combobox",{name:"Select"}).click()
   await page.getByRole("option",{name:"Super Admin"}).click()
   await page.locator('[name="password"]').fill("Sanjay@123")
   await page.getByRole("button",{name:"Save"}).click()


   const beforeCount = await page.locator("tbody tr").count()

   if(await beforeCount > 0){
    await expect(page.locator("tbody tr")).toHaveCount(beforeCount + 1)
    console.log(username+" "+"created successfully")

    const newrows = page.locator("tbody tr")
    const newcount = await newrows.count()
    for (let i = 0; i < newcount; i++) {
        const newusers = await newrows.nth(i).locator("td").first().innerText()
        console.log(newusers)
    }
    console.log(`after creating ${newcount} Users ✅`)
    console.log("==================================================================")
    }

    const deletedrows = page.locator("tbody tr:has(td)")
    const deletedcount = await deletedrows.count()

for (let i = 0; i < deletedcount; i++) {
    const deletedrow = deletedrows.nth(i)
    const deletedtext = await deletedrow.locator("td").first().innerText()

    if (deletedtext === username) {

        await row.getByRole("button").nth(1).click()
        await page.getByRole("button", { name: "Delete" }).click()
        console.log(username + " deleted successfully ✅")
        break
    }
}

    const deleterows = page.locator("tbody tr")
    const deletecount = await deleterows.count()
    for (let i = 0; i < deletecount; i++) {
        const deleteusers = await deleterows.nth(i).locator("td").first().innerText()
        console.log(deleteusers)
    }
    console.log(`after deleting ${deletecount} Users ✅`)
    console.log("==================================================================")
}

}
)