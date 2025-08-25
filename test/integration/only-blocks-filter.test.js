import path from 'path';
import SeleniumHelper from '../helpers/selenium-helper';

const {
    clickText,
    clickBlocksCategory,
    findByText,
    getDriver,
    getLogs,
    loadUri,
    notExistsByXpath,
    scope,
    textExists
} = new SeleniumHelper();

const uri = path.resolve(__dirname, '../../build/index.html');

let driver;

describe('only_blocks URL parameter filtering', () => {
    beforeAll(() => {
        driver = getDriver();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Shows all blocks when only_blocks parameter is not specified', async () => {
        await loadUri(uri);
        await notExistsByXpath('//*[div[contains(@class, "loader_background")]]');
        await clickText('Code');
        
        // Check that all categories are visible with specific block text from existing tests
        await clickBlocksCategory('Motion');
        await findByText('10', scope.blocksTab); // move 10 steps block
        
        await clickBlocksCategory('Looks');
        await findByText('Hello!', scope.blocksTab); // say Hello! block
        
        await clickBlocksCategory('Sound');
        await findByText('Meow', scope.blocksTab); // play sound Meow block
        
        await clickBlocksCategory('Events');
        await findByText('when', scope.blocksTab); // when flag clicked block
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });

    test('Shows only motion blocks when only_blocks=motion_', async () => {
        const testUri = `${uri}?only_blocks=motion_`;
        await loadUri(testUri);
        await notExistsByXpath('//*[div[contains(@class, "loader_background")]]');
        await clickText('Code');
        
        // Motion category should be visible and contain blocks
        await clickBlocksCategory('Motion');
        await findByText('10', scope.blocksTab); // move 10 steps block
        await findByText('15', scope.blocksTab); // turn 15 degrees block
        
        // Other categories should be empty or not visible
        const looksExists = await textExists('Looks', scope.blocksTab);
        if (looksExists) {
            await clickBlocksCategory('Looks');
            expect(await textExists('Hello!', scope.blocksTab)).toBeFalsy();
        }
        
        // Variables and My Blocks should always be present
        expect(await textExists('Variables', scope.blocksTab)).toBeTruthy();
        expect(await textExists('My Blocks', scope.blocksTab)).toBeTruthy();
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });

    test('Shows motion and looks blocks when only_blocks=motion_,looks_', async () => {
        const testUri = `${uri}?only_blocks=motion_,looks_`;
        await loadUri(testUri);
        await notExistsByXpath('//*[div[contains(@class, "loader_background")]]');
        await clickText('Code');
        
        // Motion category should contain blocks
        await clickBlocksCategory('Motion');
        await findByText('10', scope.blocksTab); // move 10 steps block
        
        // Looks category should contain blocks
        await clickBlocksCategory('Looks');
        await findByText('Hello!', scope.blocksTab); // say Hello! block
        
        // Sound category should be empty or not visible
        const soundExists = await textExists('Sound', scope.blocksTab);
        if (soundExists) {
            await clickBlocksCategory('Sound');
            expect(await textExists('Meow', scope.blocksTab)).toBeFalsy();
        }
        
        // Variables and My Blocks should always be present
        expect(await textExists('Variables', scope.blocksTab)).toBeTruthy();
        expect(await textExists('My Blocks', scope.blocksTab)).toBeTruthy();
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });

    test('Shows only specific block when using exact match', async () => {
        const testUri = `${uri}?only_blocks=motion_movesteps`;
        await loadUri(testUri);
        await notExistsByXpath('//*[div[contains(@class, "loader_background")]]');
        await clickText('Code');
        
        // Motion category should contain only the move steps block
        await clickBlocksCategory('Motion');
        await findByText('10', scope.blocksTab); // move 10 steps block should be present
        // Other motion blocks should not be present (turn blocks use "15" as default)
        expect(await textExists('15', scope.blocksTab)).toBeFalsy();
        
        // Variables and My Blocks should always be present
        expect(await textExists('Variables', scope.blocksTab)).toBeTruthy();
        expect(await textExists('My Blocks', scope.blocksTab)).toBeTruthy();
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });

    test('Shows multiple specific blocks when using exact matches', async () => {
        const testUri = `${uri}?only_blocks=motion_movesteps,looks_sayforsecs`;
        await loadUri(testUri);
        await notExistsByXpath('//*[div[contains(@class, "loader_background")]]');
        await clickText('Code');
        
        // Motion category should contain only move steps block
        await clickBlocksCategory('Motion');
        await findByText('10', scope.blocksTab); // move 10 steps block should be present
        expect(await textExists('15', scope.blocksTab)).toBeFalsy(); // turn blocks should not be present
        
        // Looks category should contain only say for secs block
        await clickBlocksCategory('Looks');
        await findByText('Hello!', scope.blocksTab); // say Hello! for 2 secs block
        await findByText('2', scope.blocksTab); // 2 seconds parameter
        
        // Variables and My Blocks should always be present
        expect(await textExists('Variables', scope.blocksTab)).toBeTruthy();
        expect(await textExists('My Blocks', scope.blocksTab)).toBeTruthy();
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });

    test('Shows only exception categories when no blocks match', async () => {
        const testUri = `${uri}?only_blocks=nonexistent_block`;
        await loadUri(testUri);
        await notExistsByXpath('//*[div[contains(@class, "loader_background")]]');
        await clickText('Code');
        
        // Core categories should be empty or not visible
        const motionExists = await textExists('Motion', scope.blocksTab);
        if (motionExists) {
            await clickBlocksCategory('Motion');
            expect(await textExists('10', scope.blocksTab)).toBeFalsy();
        }
        
        // Variables and My Blocks should always be present
        expect(await textExists('Variables', scope.blocksTab)).toBeTruthy();
        expect(await textExists('My Blocks', scope.blocksTab)).toBeTruthy();
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });

    test('Variables category is always visible regardless of filter', async () => {
        const testUri = `${uri}?only_blocks=motion_`;
        await loadUri(testUri);
        await notExistsByXpath('//*[div[contains(@class, "loader_background")]]');
        await clickText('Code');
        
        // Variables should be present and functional
        await clickBlocksCategory('Variables');
        await findByText('my\u00A0variable', scope.blocksTab);
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });

    test('My Blocks category is always visible regardless of filter', async () => {
        const testUri = `${uri}?only_blocks=motion_`;
        await loadUri(testUri);
        await notExistsByXpath('//*[div[contains(@class, "loader_background")]]');
        await clickText('Code');
        
        // My Blocks should be present and functional
        await clickBlocksCategory('My Blocks');
        await findByText('Make a Block', scope.blocksTab);
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });
});