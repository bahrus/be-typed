import { test, expect } from '@playwright/test';
test('ProgrammaticDeclarativeInSequence', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if(m.type() === 'error') errors.push(m.text()); });
    const requests = [];
    page.on('request', r => requests.push(r.url()));
    await page.goto('./tests/ProgrammaticDeclarativeInSequence.html');
    const triggerA = page.locator('#a > button.be-typed-trigger');
    const triggerB = page.locator('#b > button.be-typed-trigger');
    await expect(triggerA).toHaveText('✎');
    await expect(triggerB).toHaveText('✎');
    await expect(page.locator('#a > :last-child')).toHaveClass('be-typed-trigger');
    // Open the (shared) dialog from a, cancel; then open it from b and apply.
    await triggerA.click();
    await page.click('dialog button[value=cancel]');
    await triggerB.click();
    await page.fill('dialog input[name=name]', 'quantity');
    await page.selectOption('dialog select[name=type]', 'number');
    await page.click('dialog button[value=default]');
    // The edit lands on b, not on a.
    await expect(page.locator('#b > input')).toHaveAttribute('type', 'number');
    await expect(page.locator('#b > input')).toHaveAttribute('name', 'quantity');
    await expect(page.locator('#b > span')).toHaveText('quantity: ');
    await expect(page.locator('#a > input')).toHaveCount(0);
    await expect(page.locator('#a > span')).toHaveText('[Specify Name]');
    expect(errors).toEqual([]);
    // def.js registers the config directly -- no DOM monitoring is loaded.
    expect(requests.filter(u => u.includes('mount-observer'))).toEqual([]);
});
