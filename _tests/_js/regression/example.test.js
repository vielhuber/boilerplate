describe('Test puppeteer', () => {
    it('first visual regression test', async () => {
        const page = await browser.newPage();
        await page.goto('https://vielhuber.de');
        const image = await page.screenshot();
        expect(image.toString('base64')).toMatchSnapshot();
        await page.close();
    });
});
