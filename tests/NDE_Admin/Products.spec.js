const{test,expect}= require("@playwright/test")
const{login}=require("../utils/login.spec")

test.setTimeout(5 * 60 * 1000)

console.log("login triggering!!!!")

test("NDE Admin Product", async ({ page }) => {
  
 await login(page)

 // await Productcreate(page)

 // await Expectedproductdelete(page)

//  async function login(page) {
//     await page.goto("https://adminv2.nowdigitaleasy.com/login")
//     await page.locator('[name="userName"]').fill("iaaxin")
//     await page.locator('[name="password"]').fill("King_Guna")
//     await page.getByRole("button",{name:"Login"}).click()
//     await expect(page).toHaveURL(/home/)
//   }

 async function Productcreate(page) {
// await login(page)  
  const pname="Krish"
  await page.getByRole("button",{name:"Product"}).click()
  await page.getByRole("button",{name:"Create Products",exact:true}).click()
  await page.locator('[name="productName"]').fill(pname)
  await page.getByRole('dialog', { name: 'Create New Product' }).locator('input[name="hsn_code"]').fill('123');
  await page.getByRole('dialog', { name: 'Create New Product' }).locator('textarea[name="description"]').fill('testing');
  await page.getByRole("combobox",{name:"License"}).click()
  await page.getByRole("option",{name:"User"}).click()
  await page.waitForTimeout(2000)
  await page.getByRole("button",{name:"Create"}).click({timeout:1500})
  await page.screenshot({path:"screenshot.png"})
  await page.waitForTimeout(2000)
  const drow = page.locator("tr").filter({has: page.getByText(pname, { exact: true })}).first()

  if(pname && await drow.count() > 0){
    console.log(pname + " " + "created successfully")
  await drow.hover();
  await drow.locator('button').last().click()
  await page.getByRole("menuitem",{name:"Delete"}).click()
  await page.getByRole("button",{name:"Delete"}).click()
  console.log(pname + " " + "deleted successfully")

  }
  else{
    console.log(pname + " " + "created failed")
    await page.waitForTimeout(4000)
     await page.getByRole("button",{name:"Cancel"}).click()
     await page.waitForTimeout(4000)
     await page.close()
     console.log(pname + " " + "deleted failed")
  }
}

async function Expectedproductdelete(page) { 
  const edname="Product"
  await page.getByRole("button",{name:"Product"}).click()
  await page.waitForTimeout(4000)
  await page.getByRole('combobox', { name: 'Rows per page:' }).click();
  await page.getByRole('option', { name: '100' }).click();
  await page.waitForTimeout(4000)
  const edrow = page.locator("tr").filter({has: page.getByText(edname,{ exact: true })}).first()
  await edrow.hover();
  await edrow.locator('button').last().click()
  await page.getByRole("menuitem",{name:"Delete"}).click()
  await page.getByRole("button",{name:"Delete"}).click()
  await page.waitForTimeout(4000)
  if(await page.getByRole("button",{name:"Cancel"}).isVisible()){
    await page.getByRole("button",{name:"Cancel"}).click()
    await page.getByRole("cell",{name:edname}).click()
  }
  if(edname && await edrow.count() > 0){
    await page.waitForTimeout(3000)
    while (await page.getByText("Delete").count() > 0){ 
    await page.getByText("Delete").first().click() 
    await page.getByRole("button",{name:"Delete"}).click() 
    await page.locator("button").nth(5).click()
    await page.getByRole("button",{name:"Delete"}).click()
    await page.waitForTimeout(2000)
     await page.mouse.move(0, 0)
    if(await page.getByRole("button",{name:"Cancel"}).isVisible())
      await page.getByRole("button",{name:"Cancel"}).click()
  }
    // await page.getByText("Delete").first().click()
    // await page.getByRole("button",{name:"Delete"}).click()
    // await page.getByText("Delete").nth(1).click()
    // await page.getByRole("button",{name:"Delete"}).click()
    // await page.getByText("Delete").nth(2).click()
    // await page.getByRole("button",{name:"Delete"}).click()
  //   await page.goBack()
  // const edrow = page.locator("tr").filter({has: page.locator("a", { hasText: new RegExp(`^${edname}$`) })})
  // await edrow.hover();
  // await edrow.locator('button').last().click()
  // await page.getByRole("menuitem",{name:"Delete"}).click()
  // await page.getByRole("button",{name:"Delete"}).click()
  // await page.waitForTimeout(5000)
}
}

})