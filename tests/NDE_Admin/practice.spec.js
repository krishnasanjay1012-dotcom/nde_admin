const {test,expect}=require("@playwright/test")
const{login}=require("../utils/login.spec")

test("practice",async ({ page })=>{
   await login(page)
   const cname="Guna guna"
   await page.getByRole("button",{name:"Customers"}).click()
   const row=page.locator("tr",{hasText:cname}).first()
   await row.scrollIntoViewIfNeeded()
   if(expect(row).toBeVisible()){
    console.log("visible")
   }
   else{
    console.log("not visible")
   }
})