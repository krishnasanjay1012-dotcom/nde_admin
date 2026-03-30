const{test,expect}=require("@playwright/test")
const {login } = require("./login.spec.js")
test.setTimeout(5 * 60 * 1000)

test("NDE Admin Accountant",async({page})=>{
    await login(page)
    // await Accountantcreate(page)
    // await Accountantview(page)
     await view(page)

async function Accountantcreate(page) {
    const AccountName="Test 18"
    const AccountCode="18"
    const AccountType="Liabilities"
    const Currency="USD"

    await page.getByRole("button",{name:"Accountant"}).click()
    await page.getByRole("button",{name:"Accounts"}).click()
    await page.getByRole("button",{name:"Create Account"}).first().click()
    await page.getByRole("combobox",{name:"Select"}).first().click()
    await page.getByRole("menuitem",{name:AccountType,exact:true}).click()
    await page.locator('[name="accountName"]').fill(AccountName)
    await page.locator('[name="accountCode"]').fill(AccountCode)
    await page.getByRole("combobox",{name:"INR"}).click()
    await page.getByRole("option",{name:Currency}).click()
    await page.locator('[name="description"]').fill("test")
    await page.getByRole("button",{name:"Submit"}).click()
    await page.waitForTimeout(1000)
    await page.screenshot({path:"screenshot.png"})
    await page.waitForTimeout(3000)
    if(await page.getByRole("button",{name:"Cancel"}).isVisible()){
        await page.getByRole("button",{name:"Cancel"}).click()
        console.log("created Failed")
    }
    else{
        console.log("Accountant Created successfully")
               const row = page.locator("tr").filter({has: page.locator("td").nth(0).filter({ hasText: new RegExp(`^${AccountName}$`)})})
     const cells = row.locator("td")
    await row.first().scrollIntoViewIfNeeded()
    await expect(row).toBeVisible()
             await row.hover()
         await page.waitForTimeout(3000)
         await expect(cells.nth(0)).toHaveText(AccountName)
         await expect(cells.nth(1)).toHaveText(AccountCode)
         await expect(cells.nth(2)).toHaveText("asset")
         await expect(cells.nth(3)).toHaveText(Currency)
         console.log("datas viewed successfylly")
    } 
 
}

async function Accountantview(page) {
    const AccountName="Test 1"
    const AccountCode="1"
    const AccountType="asset"
    const Currency="6943846860cdda17dc7b57ea"
    
    await page.getByRole("button",{name:"Accountant"}).click()
    await page.getByRole("button",{name:"Accounts"}).click()
    await page.waitForTimeout(2000)
    await page.getByRole('combobox', { name: 'Rows per page:' }).click();
    await page.getByRole('option', { name: '100' }).click()
    await page.waitForTimeout(5000)
    const row = page.locator("tr").filter({has: page.locator("td").nth(0).filter({ hasText: new RegExp(`^${AccountName}$`)})})
     const cells = row.locator("td")
    await row.first().scrollIntoViewIfNeeded()
    await expect(row).toBeVisible()
    
    if(await row.isVisible()){
         await row.hover()
         await page.waitForTimeout(3000)
         await expect(cells.nth(0)).toHaveText(AccountName)
         await expect(cells.nth(1)).toHaveText(AccountCode)
         await expect(cells.nth(2)).toHaveText(AccountType)
         await expect(cells.nth(3)).toHaveText(Currency)
         console.log("datas viewed successfylly")
    }
    else{
        console.log("rows not to be vissible")
    }
}
 
async function view(page) {
    const AccountName="Test 18"

    await page.getByRole("button",{name:"Accountant"}).click()
    await page.getByRole("button",{name:"Accounts"}).click()

    await page.getByRole('combobox', { name: 'Rows per page:' }).click()
    await page.getByRole('option', { name: '100' }).click()

    await page.locator("table").waitFor()

    const modules = [
        "Asset Accounts",
        "Liability Accounts",
        "Revenue Accounts",
        "Expense Accounts",
        "Equity Accounts"
    ]

    for (const module of modules) {

        try{
            await page.getByRole("heading",{name:"Asset Accounts"}).click()
            await page.getByRole("menuitem",{name:module}).click()

            const row = page.locator("tr").filter({
                has: page.locator("td").nth(0).filter({
                    hasText: new RegExp(`^${AccountName}$`)
                })
            })

            const count = await row.count()
            await page.waitForTimeout(5000)
            

            if (count > 0) {
                await row.first().scrollIntoViewIfNeeded()
                console.log(`✅ ${module} → data visible`)
                
            } else {
                console.log(`❌ ${module} → data not found`)
            }
        }
        catch{
            console.log("stop")
        }

        
    }
}

})
