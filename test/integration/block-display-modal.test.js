import path from 'path';
import SeleniumHelper from '../helpers/selenium-helper';

const {
    clickXpath,
    findByText,
    getDriver,
    getLogs,
    loadUri,
    notExistsByXpath,
    scope
} = new SeleniumHelper();

const uri = path.resolve(__dirname, '../../build/index.html');

let driver;

const SETTINGS_MENU_XPATH = '//div[contains(@class, "menu-bar_menu-bar-item")]' +
    '[*[contains(@class, "settings-menu_dropdown-label")]//*[text()="Settings"]]';

describe('Block Display Modal Integration Test Framework', () => {
    beforeAll(() => {
        driver = getDriver();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Settings menu opens correctly', async () => {
        await loadUri(uri);
        await notExistsByXpath('//*[div[contains(@class, "loader_background")]]');
        
        // Click Settings menu to verify basic functionality
        await clickXpath(SETTINGS_MENU_XPATH);
        
        // Verify Settings menu contains Language option (this should always exist)
        await findByText('Language', scope.menuBar);
        
        const logs = await getLogs();
        expect(logs).toEqual([]);
    });
});