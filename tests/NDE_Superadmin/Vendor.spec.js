import { test, expect } from "@playwright/test"
import { login } from "../utils/login.js"
test.setTimeout(5 * 60 * 1000)

test("NDE Admin Vendor", async ({ page }) => {
  
   await login(page)

  //  for (let i = 1; i <= 5; i++) {
  //  await Vendorcreate(page,i)
  //  }

  //  await Expectedvendordelete(page)

  //  await multivendordelete(page)

   async function Vendorcreate(page,i){
  const vfname="Krishna"
  const vlname="Sanjay"
  await page.getByRole("button",{name:"Purchased"}).click()
  await page.getByRole("button",{name:"Vendors"}).click()
  await page.getByRole("button",{name:"New Vendor"}).first().click()
  await page.locator('[placeholder="First Name"]').fill(vfname)
    await page.locator('[placeholder="Last Name"]').fill(vlname)
    await page.locator('[placeholder="Company Name"]').fill("iaaxin")
    await page.locator('[placeholder="Email Address"]').fill(`krishnasanjay1${i}@gmail.com`)
    await page.locator('[placeholder="Mobile Number"]').fill(`73390917${i}4`)
    await page.locator('[placeholder="Enter PAN"]').first().fill("ABCDE1234F")
    await page.getByRole("combobox",{name:"India - INR"}).click()
    await page.getByRole("option",{name:"United States - USD"}).click()
    await page.getByLabel('', { exact: true }).nth(1).click();
    await page.getByRole('option', { name: 'Dividend', exact: true }).click();
    await page.locator('[placeholder="Enter GST NO"]').fill("33AADCI7484A1ZS")
    await page.locator('[name="opening_balance"]').fill("100")
    await page.getByRole("combobox",{name:"Net 30"}).click()
    await page.getByRole("option",{name:"Net 15"}).click()
    await page.getByRole("checkbox",{name:"Allow portal access for this customer"}).click()
    
    await page.getByRole("tab",{name:"Address"}).click()
    await page.locator('[name="billingaddress"]').fill("nagakonanur,vedasandur,dindigul")
  await page.getByRole('combobox', { name: 'Select' }).first().click();
  await page.getByRole('combobox', { name: 'Select' }).first().fill('india');
  await page.getByRole('combobox', { name: 'Select' }).first().press('Enter');
  await page.getByRole('option', { name: 'India', exact: true }).click();
  await page.getByRole('combobox', { name: 'Select' }).nth(1).click();
  await page.getByRole('combobox', { name: 'Select' }).nth(1).fill('Tamil Nadu');
  await page.getByRole('combobox', { name: 'Select' }).nth(1).press('Enter');
  await page.getByRole('option', { name: 'Tamil Nadu', exact: true }).click();
  await page.getByRole('combobox', { name: 'Select' }).nth(2).click();
  await page.getByRole('combobox', { name: 'Select' }).nth(2).fill('Dindigul');
  await page.getByRole('combobox', { name: 'Select' }).nth(2).press('Enter');
  await page.getByRole('option', { name: 'Dindigul', exact: true }).click();
  await page.locator('[name="billingpinCode"]').fill("624710")
  await page.locator('[name="billingphone"]').fill("7339091608")
  await page.locator('[name="billingfaxNumber"]').fill("7339091608")
  await page.getByText("Copy billing address").click()

  await page.getByRole("tab",{name:"Contact Persons"}).click()
  await page.locator('[placeholder="Select Salutation"]').first().click()
  await page.getByRole('option', { name: 'Mr.'}).click();
  await page.locator('[name="contact_persons.0.name_details.first_name"]').fill("krishna")
  await page.locator('[name="contact_persons.0.name_details.last_name"]').fill("sanjay") 
  await page.locator('[name="contact_persons.0.other_details.designation"]').fill("tester")  
  await page.locator('[name="contact_persons.0.other_details.department"]').fill("testing")  
  await page.locator('[name="contact_persons.0.email"]').fill(`krishnasanjay1${i}@gmail.com`) 
  await page.locator('[placeholder="Enter mobile number"]').first().fill("7339091700")
  await page.locator('[placeholder="Enter mobile number"]').nth(1).fill("7339091700")

    await page.getByRole("tab",{name:"Remarks"}).click()
  await page.locator('[placeholder="Enter Remarks"]').fill("for testing")
  await page.waitForTimeout(2000)
  await page.getByRole("button",{name:"Create"}).click({timeout:1000})

  await page.screenshot({ path: 'screenshot.png' })
  await page.waitForTimeout(3000)
  const vfullname = `${vfname} ${vlname}`
  const dvendorrow= page.locator("tr").filter({ has: page.getByText(vfullname, { exact: true })}).first()
    if (await dvendorrow.count() > 0){
      console.log(i+" "+vfullname + " " + "created successfully")
//await createdvendordelete(page,vfullname) 
    }

    else{ 
      await page.getByRole("button",{name:"Cancel"}).click()
      console.log(vfullname + " " + "created failed")
      await page.close()
    }

}   
   async function createdvendordelete(page,vfullname) {
      const dvendorrow= page.locator("tr").filter({ has: page.getByText(vfullname, { exact: true })}).first()
  if (await dvendorrow.count() > 0){
      await dvendorrow.hover();
      await dvendorrow.locator("button").last().click()
      await page.getByRole("menuitem",{name:"Delete"}).click({ timeout: 5000 })
      await page.getByRole("button",{name:"Delete"}).click()
      await page.waitForTimeout(3000) 

      if(await page.getByRole("button",{name:"Cancel"}).isVisible()){
         await page.getByRole("button",{name:"Cancel"}).click()
         await dvendorrow.hover();
         await dvendorrow.locator("button").last().click()
         await page.getByRole("menuitem",{name:"Edit"}).click({ timeout: 5000 })
         await page.getByRole("tab",{name:"Contact Persons"}).click()
         while (await page.getByRole("button",{name:"Delete"}).count() > 1){
                  await page.getByRole("button",{name:"Delete"}).first().click()
         }
         if (await page.getByRole("button",{name:"Delete"}).count() === 1) {
            await page.getByRole("button",{name:"Delete"}).first().click()
            await page.waitForTimeout(2000)
            await page.getByRole('button', { name: 'Update' }).click();
            await dvendorrow.hover()
            await dvendorrow.locator('button').last().click()
            await page.getByRole("menuitem",{name:"Delete"}).click()
            await page.getByRole("button",{name:"Delete"}).click()
            console.log("contacts deleted with vendor deleted")
          }
      }

      else{
      console.log("no contacts so vendor deleted")
      }
  }    
  else{ 
     await page.getByRole("button",{name:"Cancel"}).click()
     await page.close()
     console.log(vfullname +" " + "deleted failed")
  }
   }
     async function multivendordelete(page) {
        await page.getByRole("button",{name:"Purchased"}).click()
        await page.waitForTimeout(3000)
        await page.getByRole("button",{name:"Vendors"}).click()
        await page.waitForTimeout(3000)
const fullname = "krishna sanjay";
const rows = page.locator("tbody tr").filter({ hasText: fullname });

const count = await rows.count();

for (let i = 0; i < count; i++) {
  const row = rows.nth(i);

  await row.hover();
  await row.locator("button").last().click();
  await page.getByRole("menuitem",{name:"Delete"}).click();
  await page.getByRole("button",{name:"Delete"}).click();
  await page.waitForTimeout(2000);

  if (await page.getByRole("button",{name:"Cancel"}).isVisible()) {
      await page.getByRole("button",{name:"Cancel"}).click();
      await row.hover()
      await row.locator("button").last().click()
      await page.getByRole("menuitem",{name:"Edit"}).click({ timeout: 5000 })
      await page.getByRole("tab",{name:"Contact Persons"}).click()
        while (await page.getByRole("button",{name:"Delete"}).count() > 1){
               await page.getByRole("button",{name:"Delete"}).first().click()
         }
        if (await page.getByRole("button",{name:"Delete"}).count() === 1) {
            await page.getByRole("button",{name:"Delete"}).first().click()
            await page.waitForTimeout(2000)
            await page.getByRole('button', { name: 'Update' }).click();
            await row.hover()
            await row.locator('button').last().click()
            await page.getByRole("menuitem",{name:"Delete"}).click()
            await page.getByRole("button",{name:"Delete"}).click()
            await page.waitForTimeout(2500)
               if(await page.getByRole("button",{name:"Cancel"}).isVisible()){
                  await page.getByRole("button",{name:"Cancel"}).click()
                  console.log(i+" "+fullname+" "+"mapping some other place → skipping");
                  continue
               }
               else{
                console.log(fullname+" "+"deleted after removing contacts");
                i--;
               }
              }
              
  } 
  else {
    console.log(fullname+" "+"deleted successfully");
     i--;
  }
}
} 

async function Expectedvendordelete(page){
  const evd="Krishna Sanjay"
  await page.getByRole("button",{name:"Purchased"}).click()
  await page.getByRole("button",{name:"Vendors"}).click()
  const evdrow=await page.locator("tr").filter({hasText:evd}).first()
  await evdrow.hover()
  await evdrow.locator('button').last().click()
  await page.getByRole("menuitem",{name:"Delete"}).click()
  await page.getByRole("button",{name:"Delete"}).click()
  await page.waitForTimeout(3000)
  if(await page.getByRole("button",{name:"Cancel"}).first().isVisible()){
      await page.getByRole("button",{name:"Cancel"}).click()
        await evdrow.hover();
         await evdrow.locator("button").last().click()
         await page.getByRole("menuitem",{name:"Edit"}).click({ timeout: 5000 })
         await page.getByRole("tab",{name:"Contact Persons"}).click()
         while (await page.getByRole("button",{name:"Delete"}).count() > 1){
                  await page.getByRole("button",{name:"Delete"}).first().click()       
         }
         if (await page.getByRole("button",{name:"Delete"}).count() === 1) {
            await page.getByRole("button",{name:"Delete"}).first().click()
            await page.waitForTimeout(2000)
            await page.getByRole('button', { name: 'Update' }).click();
            await evdrow.hover()
            await evdrow.locator('button').last().click()
            await page.getByRole("menuitem",{name:"Delete"}).click()
            await page.getByRole("button",{name:"Delete"}).click()

            if(page.locator("tr").filter({hasText:evd}).isVisible()){
                 console.log("vendor not deleted error")
            }
            else{
              console.log("contacts deleted with vendor deleted")
            }
            
          }
    }
    else{
      console.log("no contacts so vendor deleted")
    }
}

})