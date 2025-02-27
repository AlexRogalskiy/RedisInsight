import { rte, env } from '../../../helpers/constants';
import { acceptLicenseTermsAndAddDatabaseApi } from '../../../helpers/database';
import { MyRedisDatabasePage, WorkbenchPage } from '../../../pageObjects';
import { commonUrl, ossStandaloneRedisearch } from '../../../helpers/conf';
import { deleteStandaloneDatabaseApi } from '../../../helpers/api/api-database';
import { Common } from '../../../helpers/common';

const myRedisDatabasePage = new MyRedisDatabasePage();
const workbenchPage = new WorkbenchPage();

let indexName = Common.generateWord(5);

fixture `Index Schema at Workbench`
    .meta({ type: 'critical_path', rte: rte.standalone })
    .page(commonUrl)
    .beforeEach(async t => {
        await acceptLicenseTermsAndAddDatabaseApi(ossStandaloneRedisearch, ossStandaloneRedisearch.databaseName);
        // Go to Workbench page
        await t.click(myRedisDatabasePage.NavigationPanel.workbenchButton);
    })
    .afterEach(async t => {
        // Drop index, documents and database
        await t.switchToMainWindow();
        await workbenchPage.sendCommandInWorkbench(`FT.DROPINDEX ${indexName} DD`);
        await deleteStandaloneDatabaseApi(ossStandaloneRedisearch);
    });
test
    .meta({ env: env.desktop })('Verify that user can open results in Text and Table views for FT.INFO for Hash in Workbench', async t => {
        indexName = Common.generateWord(5);
        const commandsForSend = [
            `FT.CREATE ${indexName} ON HASH PREFIX 1 product: SCHEMA name TEXT`,
            'HMSET product:1 name "Apple Juice"'
        ];
        const searchCommand = `FT.INFO ${indexName}`;

        // Send commands
        await workbenchPage.sendCommandInWorkbench(commandsForSend.join('\n'));
        // Send search command
        await workbenchPage.sendCommandInWorkbench(searchCommand);
        // Check that result is displayed in Table view
        await t.switchToIframe(workbenchPage.iframe);
        await t.expect(workbenchPage.queryTableResult.exists).ok('The result is displayed in Table view');
        // Select Text view type
        await t.switchToMainWindow();
        await workbenchPage.selectViewTypeText();
        // Check that result is displayed in Text view
        await t.expect(workbenchPage.queryTextResult.exists).ok('The result is displayed in Text view');
    });
test
    .meta({ env: env.desktop })('Verify that user can open results in Text and Table views for FT.INFO for JSON in Workbench', async t => {
        indexName = Common.generateWord(5);
        const commandsForSend = [
            `FT.CREATE ${indexName} ON JSON SCHEMA $.user.name AS name TEXT $.user.tag AS country TAG`,
            'JSON.SET myDoc1 $ \'{"user":{"name":"John Smith","tag":"foo,bar","hp":1000, "dmg":150}}\''
        ];
        const searchCommand = `FT.INFO ${indexName}`;

        // Send commands
        await workbenchPage.sendCommandInWorkbench(commandsForSend.join('\n'));
        // Send search command
        await workbenchPage.sendCommandInWorkbench(searchCommand);
        // Check that result is displayed in Table view
        await t.switchToIframe(workbenchPage.iframe);
        await t.expect(workbenchPage.queryTableResult.exists).ok('The result is displayed in Table view');
        // Select Text view type
        await t.switchToMainWindow();
        await workbenchPage.selectViewTypeText();
        // Check that result is displayed in Text view
        await t.expect(workbenchPage.queryTextResult.exists).ok('The result is displayed in Text view');
    });
