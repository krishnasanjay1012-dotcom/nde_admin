const{test,expect}= require("@playwright/test")
const{login}=require("../utils/login.spec")

test.setTimeout(5 * 60 * 1000)

test("NDE Admin Module", async ({ page }) => {
  
   await login(page)

   await Modulevisibility(page)

   async function Modulevisibility(page){
  await login(page)
 const modules=["Home","Customers","Product","Sales","Purchased","Report","Settings"]
  for (const module of modules) {
    await expect(page.getByRole("button",{name:module})).toBeVisible();
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
 if(await page.getByRole("button",{name:"Report"}).click()){
    await expect(page.getByRole("button",{name:"Report"})).toBeVisible()
 } 
 if(await page.getByRole("button",{name:"Settings"}).click()){
    await expect(page.getByRole("button",{name:"General"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Integration"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Communication"})).toBeVisible()
    await expect(page.getByRole("button",{name:"Transaction Series"})).toBeVisible()
    await expect(page.getByRole("button",{name:"User"})).toBeVisible()
 }   
}

})   