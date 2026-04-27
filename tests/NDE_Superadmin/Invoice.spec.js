import { test, expect } from "@playwright/test"
import { login } from "../utils/login.js"

test.setTimeout(5 * 60 * 1000)

test("NDE Admin Invoice", async ({ page }) => {
  
   await login(page)
    
    await Invoicecreate(page)

   // await ExpectedInvoicedelete(page)

   async function login(page) {
    await page.goto("https://adminv2.nowdigitaleasy.com/login")
    await page.locator('[name="userName"]').fill("iaaxin")
    await page.locator('[name="password"]').fill("King_Guna")
    await page.getByRole("button",{name:"Login"}).click()
    await expect(page).toHaveURL(/home/)
  }

   async function Invoicecreate(page){
  await page.getByRole("button",{name:"Sales"}).click()
  await page.getByRole("button",{name:"Invoices"}).click()
  await page.getByRole("button",{name:"Create New Invoice",exact:true}).click()
  await page.locator('[placeholder="Search Customer"]').fill("krishna")
  await page.getByText('Krishna sanjay').first().click()
  await page.locator('[name="invoiceNo"]').fill("Testing")
  await page.locator('[name="orderNo"]').fill("10")
  // await page.getByText('Invoice Date').click()
  // await page.getByText('Invoice Date').fill("12102002")
  await page.locator('[placeholder="Select"]').first().click()
  await page.getByRole("button",{name:"Due on Receipt"}).click()
  //await page.getByRole('group').filter({ hasText: 'DD/MM/YYYY' }).fill("12/10/2002")
  await page.locator('[placeholder="Select"]').nth(1).click()
  await page.getByRole("button",{name:"Guna"}).click()
  await page.locator('[name="subject"]').fill("Testing")
  await page.locator('[placeholder="Select Product"]').fill("Domain")
  await page.getByRole("option",{name:"Domain"}).first().click()
  await page.locator('[name="lineItems.0.description"]').fill("For Testing")
  await page.locator('[name="lineItems.0.quantity"]').fill("10")
  await page.locator('[name="lineItems.0.price"]').fill("10")
  await page.locator('[name="notes"]').fill("for testing")
  await page.locator('[name="discountValue"]').fill("10")
  await page.getByRole("radio",{name:"TCS"}).click()
  await page.locator('[name="adjustment"]').fill("10")
  await page.locator('[name="terms"]').fill("For Testing")
  await page.getByRole("checkbox",{name:"razorpay (Test)"}).first().click()
  await page.getByRole("checkbox",{name:"I have received the payment"}).click()
  await page.waitForTimeout(5000)
}

async function ExpectedInvoicedelete(page){
  const eid="krishna sanjay"
  await page.getByRole("button",{name:"Sales"}).click()
  await page.getByRole("button",{name:"Invoices"}).click()
  await page.waitForTimeout(3000)
  await page.getByRole('combobox', { name: 'Rows per page:' }).click()
  await page.getByRole('option', { name: '100' }).click()
  const eidrow=await page.locator("tr").filter({hasText: eid }).first()
  await eidrow.scrollIntoViewIfNeeded()
  await eidrow.hover()
  await eidrow.locator('button').last().click()
  await page.getByRole("menuitem",{name:"Delete"}).click()
  await page.getByRole("button",{name:"Delete"}).click()
  await page.waitForTimeout(3000)
    if(await page.getByRole("button",{name:"Cancel"}).isVisible()){
      await page.getByRole("button",{name:"Cancel"}).click()
       console.log("Expected invoice not deleted")
    }
    else{
      console.log("Expected invoice deleted")
    }
}
 
})   