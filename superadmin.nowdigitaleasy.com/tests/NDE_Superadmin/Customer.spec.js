import { test, expect } from "@playwright/test"
import { login } from "../utils/login.js"
test.setTimeout(5 * 30 * 1000)

test("NDE Admin Customer", async ({ page }) => {
  
   await login(page)

  // for (let i = 1; i <= 5; i++) {
  // await Contactcreate(page)
  // }

  // await Expectedcontactdelete(page)

 // await Multicontactdelete(page)

 await customers(page)
  
async function Contactcreate(page){
    const fname="Krishna"
    const lname="Sanjay" 
    await page.getByRole("button",{name:"Customers"}).click()
    await page.getByRole("button",{name:"New Customer",exact:true}).click()
    await page.getByRole("radio",{name:"individual"}).click()
    await page.locator('[placeholder="First Name"]').fill(fname)
    await page.locator('[placeholder="Last Name"]').fill(lname)
    await page.locator('[placeholder="Company Name"]').fill("iaaxin")
    // await page.locator('[placeholder="Email Address"]').fill(`ksanjay06${i}@gmail.com`)
    // await page.locator('[placeholder="Mobile Number"]').fill(`989420854${i}`)
    //     await page.locator('[placeholder="Enter PAN"]').fill(`ABCDE24${i}7F`)
    // await page.locator('[placeholder="Enter GST NO"]').fill(`33AADCI74${i}1A4ZS`)
        await page.locator('[placeholder="Email Address"]').fill("k8@gmail.com")
    await page.locator('[placeholder="Mobile Number"]').fill("9894208563")
        await page.locator('[placeholder="Enter PAN"]').fill("JWFPD5370C")
    await page.locator('[placeholder="Enter GST NO"]').fill("33AADCI7429A4ZS")
    await page.locator('[placeholder="Password"]').fill("Sanjay.@1012")
    await page.getByRole("combobox",{name:"customer"}).click()
    await page.getByRole("option",{name:"reseller"}).click()
    await page.getByRole("combobox",{name:"India - INR"}).click()
    await page.getByRole("option",{name:"United States - USD"}).click()
    await page.getByRole("radio",{name:"taxable"}).click()
    await page.getByRole("combobox",{name:"Net 20"}).click()
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
  // await page.locator('[name="contact_persons.0.email"]').fill(`ksanjay06${i}@gmail.com`) 
  await page.locator('[name="contact_persons.0.email"]').fill("k8@gmail.com") 
  await page.locator('[placeholder="Enter mobile number"]').first().fill("7339091608")
  await page.locator('[placeholder="Enter mobile number"]').nth(1).fill("8270398086")

    // await page.getByRole("button",{name:"Add Contact Person"}).click()
    // await page.locator('[placeholder="Select Salutation"]').nth(1).click()
    // await page.getByRole('option', { name: 'Mr.'}).click();
    // await page.locator('[name="contact_persons.1.name_details.first_name"]').fill("krishna")
    // await page.locator('[name="contact_persons.1.name_details.last_name"]').fill("sanjay") 
    // await page.locator('[name="contact_persons.1.other_details.designation"]').fill("tester")  
    // await page.locator('[name="contact_persons.1.other_details.department"]').fill("testing")  
    // await page.locator('[name="contact_persons.1.email"]').fill("sanjay1@gmail.com") 
    // await page.locator('[placeholder="Enter mobile number"]').nth(2).fill("7339091608")
    // await page.locator('[placeholder="Enter mobile number"]').nth(3).fill("8270398086")

  await page.getByRole("tab",{name:"Remarks"}).click()
  await page.locator('[placeholder="Enter Remarks"]').fill("for testing")
  await page.waitForTimeout(3000)
  await page.getByRole("button",{name:"Create"}).click()
  await page.waitForTimeout(5000)

  await page.screenshot({ path: 'screenshot.png' })
  const cfullname = `${fname} ${lname}`
  const dcontactrow= page.locator("tr").filter({ has: page.getByText(cfullname, { exact: true })}).first()


  if(await page.getByRole("button",{name:"Leave & Discard Changes"}).isVisible()){
     await page.getByRole("button",{name:"Leave & Discard Changes"}).click()
     await page.waitForTimeout(3000)

    if (await dcontactrow.isVisible()){
      console.log(cfullname + " " + "created successfully")
//await createdcontactdelete(page,cfullname) 
    }

    else{ 
      console.log(cfullname + " " + "created failed")
    }
  }
  else{
    await page.getByRole("button",{name:"Cancel"}).click()
    console.log("invalid datas")
  }
  

}
   async function createdcontactdelete(page,cfullname) {
    const dcontactrow= page.locator("tr").filter({ has: page.getByText(cfullname, { exact: true })}).first()
    if (await dcontactrow.count() > 0){
      await dcontactrow.hover();
      await dcontactrow.locator("button").last().click()
      await page.getByRole("menuitem",{name:"Delete"}).click({ timeout: 5000 })
      await page.getByRole("button",{name:"Delete"}).click()
      console.log(cfullname + " " + "deleted successfully")
  }    
  else{ 
     await page.getByRole("button",{name:"Cancel"}).click()
     console.log(cfullname +" " + "deleted failed")
  }
}
     async function Multicontactdelete(page) {
      await page.getByRole("button",{name:"Customers"}).click()
      await page.waitForTimeout(5000)
     const fullname="krishna sanjay"
     let count = 1
    const mcontactrow = page.locator("tbody tr").filter({ hasText: fullname }).first()
    while(await mcontactrow.count() > 0){
        await mcontactrow.hover()
        await mcontactrow.locator('button').last().click()
        await page.getByRole("menuitem",{name:"Delete"}).click()
        await page.getByRole("button",{name:"Delete"}).click()
        await page.waitForTimeout(2500)
        if(await page.getByRole("button",{name:"Cancel"}).isVisible()){
          await page.getByRole("button",{name:"Cancel"}).click()
          console.log("contact did not deleted")
          break
        }
        else{
          console.log(count+" "+fullname+" "+"deleted")
          count++
        }
    }
}

async function Expectedcontactdelete(page) {
    const ecname="test test"
     await page.getByRole("button",{name:"Customers"}).click()
     await page.getByRole('combobox', { name: 'Rows per page:' }).click()
     await page.getByRole('option', { name: '100' }).click()
     await page.waitForTimeout(3000)
     const ecdrow = page.locator("tr").filter({has: page.locator("td").filter({ hasText: ecname })}).first()
     await ecdrow.scrollIntoViewIfNeeded()
    const isVisible = await ecdrow.isVisible()

if (isVisible) {
  await ecdrow.hover()
  await ecdrow.locator('button').last().click()
  await page.getByRole("menuitem",{name:"Delete"}).click()
  await page.getByRole("button",{name:"Delete"}).click()
   console.log(ecname + " " + "Deleted Successfully")
}
 else {
  console.log(ecname + " " + "Not Deleted")
}


  
}

async function customers(page){
  await page.getByRole("button",{name:"Customers"}).click()
    // await page.locator('.MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1x2bt8n').click();
    // await page.getByRole('menuitem', { name: 'All Customers' }).click();
    await page.getByRole('combobox', { name: 'Rows per page:' }).click()
    await page.getByRole('option', { name: '100' }).click()
    await page.waitForTimeout(5000)

        console.log("Customets Count 👇")

    const rows = page.locator("tbody tr")

    const count = await rows.count()

    for (let i = 0; i < count; i++) {
        const productName = await rows.nth(i).locator("td").first().innerText()
    }
    console.log(`Total ${count} products ✅`)
}

}
)

