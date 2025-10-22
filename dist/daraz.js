import { chromium } from "playwright";
import fs from "fs/promises";
import { expect } from "playwright/test";
const MainControllers = [];
async function extractdata(page) {
    const items = page.locator("div.Ms6aG");
    for (const item of await items.all()) {
        const name = item.locator("a[title]");
        const price = item.locator("div.aBrP0 span");
        const location = item.locator("div._6uN7R span.oa6ri ");
        const sold = item.locator("div:nth-child(5) > span :nth-child(1)");
        const reviews = item.locator("div:nth-child(5) div span");
        const name_text = await name.getAttribute("title");
        const price_text = await price.innerText();
        const location_text = await location.innerText();
        let sold_text;
        if ((await sold.count()) >= 1) {
            sold_text = await sold.innerText();
        }
        let reviews_text;
        if ((await reviews.count()) >= 1) {
            reviews_text = await reviews.innerText();
        }
        MainControllers.push({
            Name: name_text?.trim(),
            Price: price_text.trim(),
            Location: location_text?.trim(),
            Sold: sold_text?.trim(),
            Reviews: reviews_text?.trim(),
        });
    }
}
(async () => {
    const browser = await chromium.launch({
        headless: false,
    });
    const page = await browser.newPage();
    const URL = "https://www.daraz.pk/#?e";
    await page.goto(URL);
    await page.fill('input[type="search"]', "Playstation 5");
    await page.click("div.search-box__search--2fC5 a");
    await page.locator("#root div.uM5g9 div a:nth-child(5)").click();
    await expect(page).toHaveTitle("Buy PlayStation Controllers Online at Best Price in Pakistan - Daraz.pk");
    await extractdata(page);
    await page.locator("div.b7FXJ>div>ul>li:nth-child(3)>a").click();
    await extractdata(page);
    await fs.writeFile("./Data/daraz_scrap.json", JSON.stringify(MainControllers));
    await browser.close();
})();
//# sourceMappingURL=daraz.js.map