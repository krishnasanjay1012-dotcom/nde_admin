import { test, expect } from "@playwright/test";
test.setTimeout(5 * 30 * 1000)

test("NDE Login", async ({ page, context }) => {

  await page.goto("https://superadmin.nowdigitaleasy.com/login")

  const invalidename="invalid"
  const validpassword="King_Guna"
  await page.locator('[name="userName"]').fill(invalidename)
  await page.locator('[name="password"]').fill(validpassword)
  await page.getByRole("button",{name:"Login"}).click()
  await expect(page).toHaveURL("https://superadmin.nowdigitaleasy.com/login")
  console.log("invalid username case passed")
     console.log("==========================================================")
  
  const validename="iaaxin"
  const invalidpassword="invalid"
  await page.locator('[name="userName"]').fill(validename)
  await page.locator('[name="password"]').fill(invalidpassword)
  await page.getByRole("button",{name:"Login"}).click()
  await expect(page).toHaveURL("https://superadmin.nowdigitaleasy.com/login")
  console.log("invalid password case passed")
    console.log("==========================================================")

  await page.locator('[name="userName"]').fill(validename)
  await page.locator('[name="password"]').fill(validpassword)
  await page.getByRole("button",{name:"Login"}).click()
  await expect(page).toHaveURL("https://superadmin.nowdigitaleasy.com/home")
  console.log("valid username & password case passed")
    console.log("==========================================================")

    console.log("Module Visibility 👇")
     await page.waitForTimeout(5000)
     const modulepage=page.locator('[class="MuiList-root MuiList-padding css-cyvzt1"]')
     const row=modulepage.locator("div span")
     const modulecount=await row.count()
     for(let i = 0;i < modulecount; i++){
      const module=await row.nth(i).first().innerText()
      console.log(module)
     }
     console.log(`Total Module : ${modulecount} ✅`)
     console.log("==========================================================")

    console.log("Available Products 👇")
    await page.getByRole("button",{name:"Product",exact:true}).click()
    await page.waitForTimeout(5000)
    const Productsrow=page.locator("tbody tr")
    const Productscount=await Productsrow.count()
    for(let i = 0 ; i < Productscount; i++ ){
      const productName=await Productsrow.nth(i).locator("p").first().textContent()
      console.log(productName)
    }
    console.log(`Total products : ${Productscount} ✅`)
    console.log("==========================================================")






});