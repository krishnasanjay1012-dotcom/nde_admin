import { test, expect } from "@playwright/test"
import { login } from "../utils/login.js"
test.setTimeout(5 * 30 * 1000)

test("NDE Admin Product", async ({ page }) => {
     await login(page)
     await Productsvisibility(page)

async function Productsvisibility(page) {
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
    console.log(`Total ${Productscount} Products ✅`)
    console.log("==================================================================")

    const pname="Testing"  
    await page.getByRole("button",{name:"Create Products",exact:true}).click()
    await page.locator('[name="productName"]').fill(pname)
    await page.getByRole('dialog', { name: 'Create New Product' }).locator('input[name="hsn_code"]').fill('123');
    await page.getByRole('dialog', { name: 'Create New Product' }).locator('textarea[name="description"]').fill('testing');
    await page.getByRole("button",{name:"Create"}).click()
    await page.waitForTimeout(3000)

    const createdproductsrows = page.locator("tbody tr")
    const createdproductscount = await createdproductsrows.count()
        for (let i = 0; i < createdproductscount; i++) {
        const Createdproducts = await createdproductsrows.nth(i).locator("td").first().innerText()
        console.log(Createdproducts)
    }
    console.log(`After Creating ${createdproductscount} Products ✅`)
    console.log("==================================================================")

    const drow = page.locator("tr").filter({has: page.getByText(pname, { exact: true })}).first()
    await drow.scrollIntoViewIfNeeded()
    await drow.hover()
    await drow.locator('button').last().click()
    await page.getByRole("menuitem",{name:"Delete"}).click()
    await page.getByRole("button",{name:"Delete"}).click()
    console.log(pname + " " + "deleted successfully")

        const deletedproductsrows = page.locator("tbody tr")
        const deletedproductcount = await deletedproductsrows.count()
        for (let i = 0; i < deletedproductcount; i++) {
        const deletedproducts = await deletedproductsrows.nth(i).locator("td").first().innerText()
        console.log(deletedproducts)
    }
    console.log(`After Deleting ${deletedproductcount} Products ✅`)
    console.log("==================================================================")
}
    
}
)