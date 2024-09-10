import { expect, Page } from "@playwright/test"
import { AsyncLocalStorage } from "async_hooks"
import { HelperBase } from "./helperBase"

export class DatepickerPage extends HelperBase{

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(startDateFromToday: number, endDateFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart = await this.selectDateInTheCalendar(startDateFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDateFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)


    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date();
        date.setDate(date.getDate() + numberOfDaysFromToday);
        const expectedDate = date.getDate().toString();
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' });
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });
        const expectedYear = date.getFullYear();
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        }
    
        // Get all elements with the expected date
        const dateElements = await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).all();
    
        if (dateElements.length === 0) {
            throw new Error(`No elements found for the date: ${expectedDate}`);
        }
    
        if (dateElements.length === 1) {
            await dateElements[0].click();
        } else {
            // Choose the correct element based on additional criteria
            // For example, you might want to click the first or second one
            await dateElements[0].click(); // or dateElements[1].click();
        }
    
        return dateToAssert;
    }
    
}

