describe('Test puppeteer', () => {
    beforeAll(async () => {
        await page.goto('https://google.com', { waitUntil: 'networkidle2' });
    }, 12000);

    it('should display "google" text on page', async () => {
        await page.waitForSelector('body');
        await expect(page.title()).resolves.toMatch('Google');
    }, 12000);
});
