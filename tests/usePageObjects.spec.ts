import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test("navigate to form page @smoke", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datepickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
});

test("parametrized methods @smoke", async ({ page }) => {
  const pm = new PageManager(page);
  const randomFullName = faker.person.fullName()
  const randomEmail = `${randomFullName
    .replace(" ", "")
    .toLowerCase()}${faker.number.int(1000)}@test.com`;

  await pm.navigateTo().formLayoutsPage();
  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
        process.env.USERNAME,
        process.env.PASSWORD,
      "Option 1"
    );
  await page.screenshot({ path: "screenshots/formsLayoutsPage.png" });
  await pm
    .onFormLayoutsPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      randomFullName,
      randomEmail,
      false
    );
  await page
    .locator("nb-card", { hasText: "Inline form" })
    .screenshot({ path: "screenshots/inlineForm.png" });
  await pm.navigateTo().datepickerPage();
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(2);
  await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(3, 5);
});

test.only("testing with argos ci", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datepickerPage();
});