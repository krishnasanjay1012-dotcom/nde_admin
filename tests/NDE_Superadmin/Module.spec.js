import { test, expect } from "@playwright/test"
import { login } from "../utils/login.js"
import { mainModule } from "node:process"

test.setTimeout(5 * 10 * 1000)

test("NDE Admin Module", async ({ page }) => {
  
   await login(page)

   // await Modulevisibility(page)

   await Module(page)

async function Modulevisibility(page){
   const modules=["Home","Customers","Product","Items","Sales","Purchased","Accountant","Report","Settings"]
    for (const module of modules) {
      await expect(page.getByRole("button",{name:module})).toBeVisible();
}
 if(await page.getByRole("button",{name:"Items"}).click()){
    await expect(page.getByRole("button",{name:"Items"})).toBeVisible()
 }   

 if(await page.getByRole("button",{name:"Sales"}).click()){
    await expect(page.getByRole("button",{name:"Invoices"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Subscriptions"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Payments"})).toBeVisible()
 }
 if(await page.getByRole("button",{name:"Purchased"}).click()){
    await expect(page.getByRole("button",{name:"Vendors"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Bills"})).toBeVisible()
    await expect(page.getByRole("button",{name:"G-Suite Transactions"})).toBeVisible()
 } 
 if(await page.getByRole("button",{name:"Accountant"}).click()){
    await expect(page.getByRole("button",{name:"Accounts"})).toBeVisible()
 } 

 if(await page.getByRole("button",{name:"Report"}).click()){
    await expect(page.getByRole("button",{name:"Report"})).toBeVisible()
 }

 if(await page.getByRole("button",{name:"Settings"}).click()){
    await expect(page.getByRole("button",{name:"General"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Integration"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Communication"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Configuration"})).toBeVisible()
    await expect(page.getByRole("button",{name:"User"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Template"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Free - Switch"})).toBeVisible()
 }   

 console.log("all modules visible clearly")
}

async function Module(page) {
const container = page.locator('.MuiBox-root css-c9w3pm')

// Ella text items eduka
const items = container.locator('text=*')
const count = await items.count()

for (let i = 0; i < count; i++) {
  const text = await items.nth(i).innerText()
  console.log(text)
}
}

})   