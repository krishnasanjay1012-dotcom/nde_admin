const { test, expect } = require("@playwright/test")

test.setTimeout(5 * 60 * 1000)

test("Now digital easy", async ({ page }) => {
  
  await page.goto("https://appdev.nowdigitaleasy.com/auth/login")

  await page.locator('[name="email"]').fill("newdemo@gmail.com")

  await page.getByRole("button",{name:"Next"}).click()

  await page.locator('[name="password"]').fill("Password@123")

  await page.getByRole("button",{name:"Log in"}).click()

  await expect(page).toHaveURL(/dashboard/)
  
  
await expect(page.getByText("Vision Now")).toBeVisible()
await expect(page.getByText("NDE Mail")).toBeVisible()
await expect(page.getByText("NDE Mail")).toBeVisible()
await expect(page.getByText("NDE Meet")).toBeVisible()
await expect(page.getByText("NDE Drive")).toBeVisible()
await expect(page.getByText("Vision Now")).toBeVisible()
await expect(page.getByText("Calendar")).toBeVisible()


async function vision(){

await page.getByLabel("Vision Now").click()
const modules=[
  "Pipelines","Contacts","Companies","Products","Activities","Settings","Forms"
]
for (const module of modules){
  await expect(page.getByRole("link", { name: module })).toBeVisible()
}

await expect(page.getByText("Messages")).toBeVisible()
await page.getByRole("button",{name:"Messages"}).click()
const messagein=[
  "All Conversations","Iaaxin","Now Digital Easy"
]
for(const message of messagein){
  await expect(page.getByRole("link",{name:message})).toBeVisible()
}

await expect(page.getByText("Campaigns")).toBeVisible()
await page.getByRole("button",{name:"Campaigns"}).click()
const campainin=[
  "All Conversations","Iaaxin","Now Digital Easy"
]
for(const campain of campainin){
  await expect(page.getByRole("link",{name:campain})).toBeVisible()

}}

await vision()
async function opencontacts(){
await page.getByRole("link",{name:"vision now"}).click()
await page.getByRole("link",{name:"Contacts"}).click()
await page.getByRole("combobox",{name:"20"}).click()
await page.getByRole("option",{name:"100"}).click()
}

async function addcontact() {

await opencontacts()

await page.getByRole("button",{name:"Contact",exact:true}).first().click();

const name = "Automation Testing " + Date.now();

await page.locator('[id="contacts.lastName"]').fill(name);

await page.getByRole("combobox",{name:"Select..."}).click()

await page.getByRole("option",{name:"Sample 2"}).click()

await page.getByRole('combobox').nth(2).click();

  await page.getByRole('textbox', { name: 'Search country...' }).fill('india');
  await page.getByRole('option', { name: 'India (+91)' }).click();

await page.getByRole("combobox").nth(3).click()

  await page.getByRole('textbox', { name: 'Search country...' }).fill('india');
  await page.getByRole('option', { name: 'India (+91)' }).click();

await page.getByRole("combobox").nth(4).click()
  
  await page.getByRole('textbox', { name: 'Search country...' }).fill('india');
  await page.getByRole('option', { name: 'India (+91)' }).click();

await page.getByRole("combobox",{name:"crm"}).click() 
await page.getByRole("option",{name:"facebook"}).click()

const contactdata={
  mailingZip:"123",
  assistant:"me",
  mailingCountry:"india",
  firstName:"sanjay",
  email:"krishnasanjay1012@getMaxListeners.com",
  department:"cs",
  mailingCity:"dindigul",
  mailingStreet:"vedasandur",
  AsstPhone:"7339091608",
  homePhone:"8270398086",
  description:"automation testing",
  mailingState:"tamilnadu",
  secondaryEmail:"indhumathy898@gmail.com",
  otherPhone:"73738155156",
  otherZip:"123",
  otherStreet:"vedasandur",
  otherState:"tamilnadu",
  OtherCity:"dindigul",
  OtherCountry:"india",
}
 for(const datas in contactdata){
  await page.locator(`[id="contacts.${datas}"]`).fill(contactdata[datas])
 }
  // await page.locator('[id="contacts.mailingZip"]').fill(contactdata.MailingZip)
  // await page.locator('[id="contacts.assistant"]').fill(contactdata.Assistant)
  // await page.locator('[id="contacts.mailingCountry"]').fill(contactdata.MailingCountry)
  // await page.locator('[id="contacts.firstName"]').fill(contactdata.FirstName)
  // await page.locator('[id="contacts.email"]').fill(contactdata.Email)
  // await page.locator('[id="contacts.department"]').fill(contactdata.Department)
  // await page.locator('[id="contacts.mailingCity"]').fill(contactdata.MailingCity)
  // await page.locator('[id="contacts.mailingStreet"]').fill(contactdata.MailingStreet)
await page.locator('[id="contacts.Asst Phone"]').fill(contactdata.AsstPhone)
// await page.locator('[id="contacts.homePhone"]').fill(contactdata.HomePhone)
// await page.locator('[id="contacts.description"]').fill(contactdata.Description)
// await page.locator('[id="contacts.mailingState"]').fill(contactdata.MailingState)
// await page.locator('[id="contacts.secondaryemail"]').fill(contactdata.SecondaryEmail)
// await page.locator('[id="contacts.otherZip"]').fill(contactdata.OtherZip)
// await page.locator('[id="contacts.otherphone"]').fill(contactdata.OtherPhone)
// await page.locator('[id="contacts.otherStreet"]').fill(contactdata.OtherStreet)
// await page.locator('[id="contacts.otherState"]').fill(contactdata.OtherState)
// await page.locator('[id="contacts.OtherCity"]').fill(contactdata.OtherCity)
// await page.locator('[id="contacts.OtherCountry"]').fill(contactdata.OtherCountry)

await page.getByRole("button",{name:"Save"}).click()

await page.locator('[data-testid="KeyboardBackspaceOutlinedIcon"]').click()

await expect(page.locator("tr",{hasText:name})).toBeVisible({timeout:10000})

}
await addcontact()


async function deleting(name){

await opencontacts()
const row = page.locator("tr", { hasText: name }).first()

await row.hover();

await row.locator('[data-testid="DeleteOutlineIcon"]').click();

await page.getByRole("button", { name: "Delete Contact" }).click();
}
await deleting("Automation Testing")


async function editing(name){

await opencontacts()
const row = page.locator("tr", { hasText: name }).first()

await row.hover();

await row.locator('[data-testid="EditOutlinedIcon"]').click();
const fname="Krishna"
const lname="sanjay"
 await page.locator('[id="contacts.firstName"]').fill(fname)
await page.locator('[id="contacts.lastName"]').fill(lname)
await page.getByRole("button",{name:"Save"}).click()
 const fullname=`${fname} ${lname}`
 await expect(page.locator("tr",{hasText:fullname})).toBeVisible()
}
await editing("indu guna")

await page.waitForTimeout(5000);

});