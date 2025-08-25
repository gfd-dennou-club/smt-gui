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
        
        // Check that all categories are visible
        await clickBlocksCategory('Motion');
        expect(await textExists('move', scope.blocksTab)).toBeTruthy();
        
        await clickBlocksCategory('Looks');
        expect(await textExists('say', scope.blocksTab)).toBeTruthy();
        
        await clickBlocksCategory('Sound');
        expect(await textExists('play sound', scope.blocksTab)).toBeTruthy();
        
        await clickBlocksCategory('Events');
        expect(await textExists('when', scope.blocksTab)).toBeTruthy();
        
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
        expect(await textExists('move', scope.blocksTab)).toBeTruthy();
        expect(await textExists('turn', scope.blocksTab)).toBeTruthy();
        
        // Other categories should be empty or not visible
        const looksExists = await textExists('Looks', scope.blocksTab);
        if (looksExists) {
            await clickBlocksCategory('Looks');
            expect(await textExists('say', scope.blocksTab)).toBeFalsy();
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
        expect(await textExists('move', scope.blocksTab)).toBeTruthy();
        
        // Looks category should contain blocks
        await clickBlocksCategory('Looks');
        expect(await textExists('say', scope.blocksTab)).toBeTruthy();
        
        // Sound category should be empty or not visible
        const soundExists = await textExists('Sound', scope.blocksTab);
        if (soundExists) {
            await clickBlocksCategory('Sound');
            expect(await textExists('play sound', scope.blocksTab)).toBeFalsy();
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
        expect(await textExists('move', scope.blocksTab)).toBeTruthy();
        // Other motion blocks should not be present
        expect(await textExists('turn', scope.blocksTab)).toBeFalsy();
        
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
        expect(await textExists('move', scope.blocksTab)).toBeTruthy();
        expect(await textExists('turn', scope.blocksTab)).toBeFalsy();
        
        // Looks category should contain only say for secs block
        await clickBlocksCategory('Looks');
        expect(await textExists('say', scope.blocksTab)).toBeTruthy();
        // Check that it's specifically the "say for secs" block, not just "say"
        expect(await textExists('Hello!', scope.blocksTab)).toBeTruthy();
        
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
            expect(await textExists('move', scope.blocksTab)).toBeFalsy();
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
        expect(await textExists('my\u00A0variable', scope.blocksTab)).toBeTruthy();
        
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
        expect(await textExists('Make a Block', scope.blocksTab)).toBeTruthy();
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });
});