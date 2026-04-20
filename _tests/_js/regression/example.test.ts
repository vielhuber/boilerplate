describe('Test puppeteer', () => {
    it('first visual regression test', async () => {
        const page = await browser.newPage();
        await page.goto('https://example.com');
        const image = await page.screenshot();
        expect(Buffer.from(image).toString('base64')).toMatchSnapshot();
        await page.close();
    });
});
