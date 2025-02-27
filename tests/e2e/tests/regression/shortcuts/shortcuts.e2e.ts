import { ClientFunction } from 'testcafe';
import { rte, env } from '../../../helpers/constants';
import { acceptLicenseTerms } from '../../../helpers/database';
import { MyRedisDatabasePage } from '../../../pageObjects';
import { commonUrl } from '../../../helpers/conf';

const myRedisDatabasePage = new MyRedisDatabasePage();
const getPageUrl = ClientFunction(() => window.location.href);

fixture `Shortcuts`
    .meta({ type: 'regression', rte: rte.none })
    .page(commonUrl)
    .beforeEach(async() => {
        await acceptLicenseTerms();
    });
test
    .meta({ env: env.web })('Verify that user can see a summary of Shortcuts by clicking "Keyboard Shortcuts" button in Help Center', async t => {
        const link = 'https://github.com/RedisInsight/RedisInsight/releases';

        // Click on help center icon and verify panel
        await t.click(myRedisDatabasePage.NavigationPanel.helpCenterButton);
        await t.expect(myRedisDatabasePage.NavigationPanel.HelpCenter.helpCenterPanel.exists).ok('Help Center panel is not opened');
        // Click on Shortcuts option and verify panel
        await t.click(myRedisDatabasePage.NavigationPanel.HelpCenter.helpCenterShortcutButton);
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsPanel.exists).ok('Shortcuts panel is not opened');
        // Validate Title and sections of Shortcuts
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsPanel.exists).ok('Shortcuts panel is not opened');
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsTitle.exists).ok('shortcutsTitle is not opened');
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsCLISection.exists).ok('shortcutsCLISection is not displayed');
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsWorkbenchSection.exists).ok('shortcutsWorkbenchSection is not displayed');
        // Verify that user can close the Shortcuts
        await t.click(myRedisDatabasePage.ShortcutsPanel.shortcutsCloseButton);
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsPanel.exists).notOk('Shortcuts panel is not displayed');

        // Click on the Release Notes in Help Center
        await t.click(myRedisDatabasePage.NavigationPanel.helpCenterButton);
        await t.click(myRedisDatabasePage.NavigationPanel.HelpCenter.helpCenterReleaseNotesButton);
        // Verify redirected link opening Release Notes in Help Center
        await t.expect(getPageUrl()).eql(link, 'The Release Notes link not correct');
    });
test
    .meta({ env: env.desktop })('Verify that user can see a summary of Shortcuts by clicking "Keyboard Shortcuts" button in Help Center for desktop', async t => {
        // Click on help center icon and verify panel
        await t.click(myRedisDatabasePage.NavigationPanel.helpCenterButton);
        await t.expect(myRedisDatabasePage.NavigationPanel.HelpCenter.helpCenterPanel.exists).ok('Help Center panel is not opened');
        // Click on Shortcuts option and verify panel
        await t.click(myRedisDatabasePage.NavigationPanel.HelpCenter.helpCenterShortcutButton);
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsPanel.exists).ok('Shortcuts panel is not opened');
        // Validate Title and sections of Shortcuts
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsPanel.exists).ok('Shortcuts panel is not opened');
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsTitle.exists).ok('shortcutsTitle is not opened');
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsDesktopApplicationSection.exists).ok('shortcutsDesktopApplicationSection is not opened');
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsCLISection.exists).ok('shortcutsCLISection is not displayed');
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsWorkbenchSection.exists).ok('shortcutsWorkbenchSection is not displayed');
        // Verify that user can close the Shortcuts
        await t.click(myRedisDatabasePage.ShortcutsPanel.shortcutsCloseButton);
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsPanel.exists).notOk('Shortcuts panel is not displayed');
    });
test('Verify that user can see description of the “up” shortcut in the Help Center > Keyboard Shortcuts > Workbench table', async t => {
    const description = [
        'Quick-access to command history',
        'Up Arrow'
    ];
    const description2 = [
        'Use Non-Redis Editor',
        'Shift+Space'
    ];

    // Open Shortcuts
    await t.click(myRedisDatabasePage.NavigationPanel.helpCenterButton);
    await t.click(myRedisDatabasePage.NavigationPanel.HelpCenter.helpCenterShortcutButton);

    // Verify that user can see the description of the “Shift+Space” keyboard shortcut in the Keyboard Shortcuts
    for (const element of description2) {
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsPanel.textContent).contains(element, 'The user can not see description of the “Shift+Space” shortcut');
    }

    // Verify that user can see description of the “up” shortcut
    for (const element of description) {
        await t.expect(myRedisDatabasePage.ShortcutsPanel.shortcutsPanel.textContent).contains(element, 'The user can not see description of the “up” shortcut');
    }
});
