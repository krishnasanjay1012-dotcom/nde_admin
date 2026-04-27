import { test, expect } from "@playwright/test"
import { login } from "../utils/login.js"
test.setTimeout(5 * 10 * 1000)

test("NDE Admin Login",async ({ page })=>{
await login(page)
// await Modulevisibility(page)
// await Products(page)
// await users(page)

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
    await page.getByRole("button",{name:"Settings"}).click()

 console.log("all modules visible clearly ✅")
 console.log("==================================================================")


}

async function Products(page) {
    await page.getByRole("button",{name: 'Product', exact: true}).click()
    await page.waitForTimeout(3000)
    await page.locator('.MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-1x2bt8n').click();
    await page.getByRole('menuitem', { name: 'All Products' }).click();
    await page.getByRole('combobox', { name: 'Rows per page:' }).click()
    await page.getByRole('option', { name: '100' }).click()
    await page.waitForTimeout(5000)

    console.log("Available Products 👇")

    const Productsrows = page.locator("tbody tr")

    const Productscount = await Productsrows.count()

    for (let i = 0; i < Productscount; i++) {
        const productname = await Productsrows.nth(i).locator("td").first().innerText()
        console.log(productname)
    }
    console.log(`Current ${Productscount} Products ✅`)
    console.log("==================================================================")
    console.log("Product Create Processing 👇")

    const pname="Testing"  
    await page.getByRole("button",{name:"Create Products",exact:true}).click()
    await page.locator('[name="productName"]').fill(pname)
    await page.getByRole('dialog', { name: 'Create New Product' }).locator('input[name="hsn_code"]').fill('123');
    await page.getByRole('dialog', { name: 'Create New Product' }).locator('textarea[name="description"]').fill('testing');
    await page.getByRole("button",{name:"Create"}).click()
    console.log(pname + " " + "created successfully ✅")
    await page.waitForTimeout(3000)

    const createdproductsrows = page.locator("tbody tr")
    const createdproductscount = await createdproductsrows.count()
    //     for (let i = 0; i < createdproductscount; i++) {
    //     const Createdproducts = await createdproductsrows.nth(i).locator("td").first().innerText()
    //     console.log(Createdproducts)
    // }
    console.log(`After Creating ${createdproductscount} Products ✅`)
    console.log("==================================================================")
    console.log("Product Delete Processing 👇")

    const drow = page.locator("tr").filter({has: page.getByText(pname, { exact: true })}).first()
    await drow.scrollIntoViewIfNeeded()
    await drow.hover()
    await drow.locator('button').last().click()
    await page.getByRole("menuitem",{name:"Delete"}).click()
    await page.getByRole("button",{name:"Delete"}).click()
    console.log(pname + " " + "deleted successfully ✅")
    await page.waitForTimeout(3000)

        const deletedproductsrows = page.locator("tbody tr")
        const deletedproductcount = await deletedproductsrows.count()
    //     for (let i = 0; i < deletedproductcount; i++) {
    //     const deletedproducts = await deletedproductsrows.nth(i).locator("td").first().innerText()
    //     console.log(deletedproducts)
    // }
    console.log(`After Deleting ${deletedproductcount} Products ✅`)
    console.log("==================================================================")
}

async function users(page){

   await page.getByRole("button",{name: 'Settings', exact: true}).click()
   await page.getByRole("button",{name: 'User', exact: true}).click()
   await page.waitForTimeout(3000)

      console.log("Current users 👇")

    const usersrows = page.locator("tbody tr")

    const userscount = await usersrows.count()

    for (let i = 0; i < userscount; i++) {
        const productName = await usersrows.nth(i).locator("td").first().innerText()
        console.log(productName)
    }
    console.log(`Current ${userscount} Users ✅`)
   console.log("==================================================================")
   console.log("Users Create Processing 👇")

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
    // for (let i = 0; i < newcount; i++) {
    //     const newusers = await newrows.nth(i).locator("td").first().innerText()
    //     console.log(newusers)
    // }
    console.log(`after creating ${newcount} Users ✅`)
    console.log("==================================================================")
    console.log("Users Delete Processing 👇")
    }

    const rows = page.locator("tbody tr:has(td)")
    const count = await rows.count()

for (let i = 0; i < count; i++) {
    const row = rows.nth(i)
    const text = await row.locator("td").first().innerText()

    if (text === username) {

        await row.getByRole("button").nth(1).click()
        await page.getByRole("button", { name: "Delete" }).click()
        await page.waitForTimeout(4000)
        console.log(username + " deleted successfully ✅")
        break
    }
}

    const deleterows = page.locator("tbody tr")
    const deletecount = await deleterows.count()
    // for (let i = 0; i < deletecount; i++) {
    //     const deleteusers = await deleterows.nth(i).locator("td").first().innerText()
    //     console.log(deleteusers)
    // }
    console.log(`after deleting ${deletecount} Users ✅`)
    console.log("==================================================================")
}

})