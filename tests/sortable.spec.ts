import { expect, Locator, Page, test } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('localhost:8080');
});

test.afterAll(async () => {
    await page.close();
});

test('Drag and drop parent elements', async () => {
    const firstDragdroppable = page.getByTestId('parent-dragdroppable').first();
    const secondDragdroppable = page.getByTestId('parent-dragdroppable').nth(1);

    // Assert initial state
    await assertText(firstDragdroppable, 'one', 'First drag and drop item contains incorrect or unexpected text');
    await assertText(secondDragdroppable, 'two', 'Second drag and drop item contains incorrect or unexpected text');

    // DRAG AND DROP PARENT ELEMENT
    await firstDragdroppable.dragTo(secondDragdroppable);

    // Assert state after drag and drop
    await assertText(firstDragdroppable, 'two', 'First drag and drop item contains incorrect text after drag and drop event');
    await assertText(secondDragdroppable, 'one', 'Second drag and drop item contains incorrect text after drag and drop event');
});

test('Drag and drop child elements', async () => {
    const firstChildDragdroppable = page.getByTestId('child-dragdroppable').first();
    const lastChildDragdroppable = page.getByTestId('child-dragdroppable').last();

    // Assert initial state
    await assertText(firstChildDragdroppable, 'child 1', 'First child drag and drop item contains incorrect or unexpected text');
    await assertText(lastChildDragdroppable, 'child 4', 'Last child drag and drop item contains incorrect or unexpected text');

    // DRAG AND DROP CHILD ELEMENT
    // Move 1st child to 4th child position
    // Order should then be 2, 3, 4, 1
    await firstChildDragdroppable.dragTo(lastChildDragdroppable);

    // Assert state after drag and drop
    await assertText(firstChildDragdroppable, 'child 2', 'First child drag and drop item contains incorrect text after drag and drop event');
    await assertText(lastChildDragdroppable, 'child 1', 'Last child drag and drop item contains incorrect text after drag and drop event');
});

test('Dragging child into parent section does not change order of parents', async () => {
    const firstDragdroppable = page.getByTestId('parent-dragdroppable').first();
    const secondDragdroppable = page.getByTestId('parent-dragdroppable').nth(1);
    const firstChildDragdroppable = page.getByTestId('child-dragdroppable').first();
    const lastChildDragdroppable = page.getByTestId('child-dragdroppable').last();
    const containerBox = await page.locator('#draganddrop .sg--sectionContent div').first().boundingBox();

    // Assert initial state
    await assertText(firstDragdroppable, 'one', 'First drag and drop item contains incorrect or unexpected text');
    await assertText(secondDragdroppable, 'two', 'Second drag and drop item contains incorrect or unexpected text');
    await assertText(firstChildDragdroppable, 'child 1', 'First child drag and drop item contains incorrect or unexpected text');
    await assertText(lastChildDragdroppable, 'child 4', 'Last child drag and drop item contains incorrect or unexpected text');

    // DRAG AND DROP CHILD ELEMENT
    // Move 4th child to 1st parent position
    // Children order should then be 4, 1, 2, 3
    // Parent order should remain the same because you can not move children into parent sections
    const firstParentBox = await firstDragdroppable.boundingBox();

    // await lastChildDragdroppable.hover();
    // await page.mouse.down();
    // await page.mouse.move(firstParentBox.x, firstParentBox.y);
    await lastChildDragdroppable.dragTo(firstDragdroppable);
    // await firstDragdroppable.hover();
    // await page.mouse.up();


    // Assert state after drag and drop
    await assertText(firstDragdroppable, 'one', 'First drag and drop item contains incorrect or unexpected text');
    await assertText(secondDragdroppable, 'two', 'Second drag and drop item contains incorrect or unexpected text');
    await assertText(firstChildDragdroppable, 'child 4', 'First child drag and drop item contains incorrect or unexpected text');
    await assertText(lastChildDragdroppable, 'child 3', 'Last child drag and drop item contains incorrect or unexpected text');
});

async function assertText(element: Locator, expectedText: string | RegExp, errorMsg?: string, options: { innerTextUsed?: boolean } = {}): Promise<void> {
    const innerTextUsed = options.innerTextUsed !== undefined ? options.innerTextUsed : true;
    errorMsg = errorMsg || `Expected text to be "${expectedText}" but found "${await element.innerText()}"`;
    await expect(element, errorMsg).toHaveText(expectedText, { useInnerText: innerTextUsed });
}