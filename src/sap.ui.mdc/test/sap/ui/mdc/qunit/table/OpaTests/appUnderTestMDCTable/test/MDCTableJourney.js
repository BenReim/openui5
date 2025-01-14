/* global QUnit */

sap.ui.define([
	"sap/base/Log",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	'test-resources/sap/ui/mdc/testutils/opa/TestLibrary',
	"test-resources/sap/ui/mdc/qunit/table/OpaTests/pages/Arrangements",
	"test-resources/sap/ui/mdc/qunit/table/OpaTests/pages/Util",
	"test-resources/sap/ui/mdc/qunit/table/OpaTests/pages/AppUnderTestMDCTable",
	"sap/ui/core/library"
], function(
	/** @type sap.base.Log */ Log,
	/** @type sap.ui.test.Opa5 */ Opa5,
	/** @type sap.ui.test.opaQunit */ opaTest,
	/** @type sap.ui.test.Opa5 */ TestLibrary,
	/** @type sap.ui.test.Opa5 */ Arrangements,
	/** @type sap.ui.mdc.qunit.table.OpaTests.pages.Util */ Util,
	/** @type sap.ui.test.PageObjectDefinition */ TestObjects,
	coreLibrary) {
	"use strict";

	if (window.blanket) {
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		viewNamespace: "appUnderTestMDCTable",
		arrangements: new Arrangements(),
		autoWait: true,
		async: true,
		timeout: 40,
		debugTimeout: 40,
		pollingInterval: 10,
		appParams: {
			"sap-ui-animation": false
		}
	});

	var sTableId = "container-appUnderTestMDCTable---MyView--mdcTable";

	QUnit.module("MDC Table OpaTests");

	opaTest("After starting the OPA tests and I look at the screen I should see an MDCTable", function(Given, When, Then) {
		//insert application
		Given.iStartMyApp();
		When.onTheAppUnderTestMDCTable.iLookAtTheScreen();
		Then.onTheAppUnderTestMDCTable.iShouldSeeATable(sTableId);
	});

	/* =========================================================== */
	/* opaTests that are tableType independent                     */
	/* =========================================================== */
	opaTest("The table should have the 'Select All' check box", function(Given, When, Then) {
		Then.onTheAppUnderTestMDCTable.iShouldSeeTheSelectAllCheckBox(sTableId);
	});

	opaTest("The table should have a title", function(Given, When, Then) {
		Then.onTheAppUnderTestMDCTable.iShouldSeeTheHeaderText(sTableId, "Products");
	});

	opaTest("The table should have a item count", function(Given, When, Then) {
		Then.onTheAppUnderTestMDCTable.iShouldSeeTheCount(sTableId);
	});

	opaTest("The table should have a variant management", function(Given, When, Then) {
		Then.onTheAppUnderTestMDCTable.iShouldSeeTheVariantManagement(sTableId);
	});

	opaTest("The table should have the show/hide details button", function(Given, When, Then) {
		Then.onTheAppUnderTestMDCTable.iShouldSeeTheShowHideDetailsButton(sTableId);
	});

	opaTest("The table should have the paste button", function(Given, When, Then) {
		Then.onTheAppUnderTestMDCTable.iShouldSeeThePasteButton(sTableId);
	});

	opaTest("The table should have the p13n button", function(Given, When, Then) {
		Then.onTheAppUnderTestMDCTable.iShouldSeeTheP13nButton(sTableId);
	});

	/* ================================================================ */
	/* opaTests related to the excel export                             */
	/*                                                                  */
	/* THESE TESTS ARE SKIPPED IF NO sap.ui.export LIBRARY IS AVAILABLE */
	/* ================================================================ */
	if (sap.ui.getCore().getLoadedLibraries().hasOwnProperty("sap.ui.export")) {
		opaTest("The table should have the export button", function(Given, When, Then) {
			Then.onTheAppUnderTestMDCTable.iShouldSeeTheExportMenuButton(sTableId);
		});

		opaTest("Export to Excel via quick export", function(Given, When, Then) {
			When.onTheAppUnderTestMDCTable.iPressQuickExportButton(sTableId);
			Then.onTheAppUnderTestMDCTable.iShouldSeeExportProcessDialog();
		});

		opaTest("Export to Excel via menu", function(Given, When, Then) {
			When.onTheAppUnderTestMDCTable.iPressExportMenuButton(sTableId);
			Then.onTheAppUnderTestMDCTable.iShouldSeeExportMenu();
			When.onTheAppUnderTestMDCTable.iPressExportButtonInMenu();
			Then.onTheAppUnderTestMDCTable.iShouldSeeExportProcessDialog();
		});

		opaTest("Export to Excel via Export as...", function(Given, When, Then) {
			When.onTheAppUnderTestMDCTable.iPressExportMenuButton(sTableId);
			When.onTheAppUnderTestMDCTable.iPressExportAsButtonInMenu();
			Then.onTheAppUnderTestMDCTable.iShouldSeeExportSettingsDialog();
			When.onTheAppUnderTestMDCTable.iFillInExportSettingsDialog(sTableId, {
				fileName: "Products List",
				fileType: "XLSX",
				includeFilterSettings: true,
				splitCells: true
			});
			Then.onTheAppUnderTestMDCTable.iShouldSeeExportProcessDialog();
		});
	} else {
		Log.warning("sap.ui.export not available", "Export tests are skipped, ensure sap.ui.export is loaded to execute them");
	}

	/* =========================================================== */
	/* opaTests when tableType is ResponsiveTableType              */
	/* =========================================================== */
	opaTest("Select / de-select all visible rows via 'Select all'", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iClickOnSelectAllCheckBox(sTableId);
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, true);
		When.onTheAppUnderTestMDCTable.iClickOnSelectAllCheckBox(sTableId);
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, false);
	});

	opaTest("Change the multiSelectMode to 'ClearAll'", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iChangeMultiSelectMode(sTableId, "ClearAll");
		Then.onTheAppUnderTestMDCTable.iShouldSeeTheDeselectAllIcon(sTableId);
	});

	opaTest("Select / de-select some rows via the check box", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iClickOnRowSelectCheckBox(sTableId, 3, 6);
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 3, 6);
		When.onTheAppUnderTestMDCTable.iClickOnRowSelectCheckBox(sTableId, 6, 6);
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 3, 5);
		When.onTheAppUnderTestMDCTable.iClickOnClearAllIcon(sTableId);
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, false);
	});

	opaTest("Interact with the Show / Hide Details button", function(Given, When, Then) {
		Then.onTheAppUnderTestMDCTable.iShouldSeePopins(sTableId, false);
		When.onTheAppUnderTestMDCTable.iPressShowMoreButton(sTableId);
		Then.onTheAppUnderTestMDCTable.iShouldSeePopins(sTableId, true);
		When.onTheAppUnderTestMDCTable.iPressShowLessButton(sTableId);
		Then.onTheAppUnderTestMDCTable.iShouldSeePopins(sTableId, false);
	});

	//test the public actions
	opaTest("Tests the public actions in combination with a ResponsiveTable", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iChangeMultiSelectMode(sTableId, "Default");
		When.onTheAppUnderTestMDCTable.iSelectAllRows(sTableId); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, true);
		When.onTheAppUnderTestMDCTable.iClearSelection(sTableId); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, false);
		When.onTheAppUnderTestMDCTable.iSelectSomeRows(sTableId, 3, 6); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 3, 6);
		When.onTheAppUnderTestMDCTable.iDeselectSomeRows(sTableId, 6, 6); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 3, 5);
		When.onTheAppUnderTestMDCTable.iClearSelection(sTableId); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, false);
	});

	/* =========================================================== */
	/* opaTests when tableType is GridTableType                    */
	/* =========================================================== */
	opaTest("The table should be changed to type 'Table' so it has a GridTable inside", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iChangeType(sTableId, "Table");
		Then.onTheAppUnderTestMDCTable.iShouldSeeTheDeselectAllIcon(sTableId);
	});

	opaTest("Select / de-select some rows via the check box", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iClickOnRowSelectCheckBox(sTableId, 2, 8);
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 2, 8);
		When.onTheAppUnderTestMDCTable.iClickOnRowSelectCheckBox(sTableId, 6, 6);
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 2, 5);
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 7, 8);
		When.onTheAppUnderTestMDCTable.iClickOnClearAllIcon(sTableId);
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, false);
	});

	opaTest("Select / de-select all visible rows via 'Select all'", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iChangeLimit(sTableId, 0);
		Then.onTheAppUnderTestMDCTable.iShouldSeeTheSelectAllCheckBox(sTableId);
		When.onTheAppUnderTestMDCTable.iClickOnSelectAllCheckBox(sTableId);
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, true);
		When.onTheAppUnderTestMDCTable.iClickOnSelectAllCheckBox(sTableId);
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, false);
	});

	//test the public actions
	opaTest("Tests the public actions in combination with a GridTable", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iSelectAllRows(sTableId); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, true);
		When.onTheAppUnderTestMDCTable.iClearSelection(sTableId); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, false);
		When.onTheAppUnderTestMDCTable.iSelectSomeRows(sTableId, 2, 8); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 2, 8);
		When.onTheAppUnderTestMDCTable.iDeselectSomeRows(sTableId, 6, 6); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 2, 5);
		Then.onTheAppUnderTestMDCTable.iShouldSeeSomeRowsSelected(sTableId, 7, 8);
		When.onTheAppUnderTestMDCTable.iClearSelection(sTableId); // <- public action
		Then.onTheAppUnderTestMDCTable.iShouldSeeAllVisibleRowsSelected(sTableId, false);
	});

	/* =========================================================== */
	/* Column menu                                                 */
	/* =========================================================== */

	opaTest("Open column menu", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iPressOnColumnHeader("Category");
		Then.onTheAppUnderTestMDCTable.iShouldSeeOneColumnMenu();
		Then.onTheAppUnderTestMDCTable.iShouldSeeNumberOfColumnMenuQuickActions(2);
		Then.onTheAppUnderTestMDCTable.iShouldSeeColumnMenuQuickSort({key: "Category", label: "Category", sortOrder: coreLibrary.SortOrder.None});
		Then.onTheAppUnderTestMDCTable.iShouldSeeColumnMenuQuickGroup({key: "Category", label: "Category", grouped: false});
		Then.onTheAppUnderTestMDCTable.iShouldSeeNumberOfColumnMenuItems(4);
		Then.onTheAppUnderTestMDCTable.iShouldSeeColumnMenuItems([
			Util.P13nDialogInfo.Titles.sort,
			Util.P13nDialogInfo.Titles.filter,
			Util.P13nDialogInfo.Titles.group,
			Util.P13nDialogInfo.Titles.columns
		]);
	});

	// TODO: Re-enable tests that are commented out. They are using APIs from qunit/p13n/OpaTests/utility. Make them reusable.

	opaTest("Sort with column menu quick action", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iUseColumnMenuQuickSort({key: "Category", sortOrder: coreLibrary.SortOrder.Ascending});
		//Then.onTheAppUnderTestMDCTable.iShouldSeeColumnSorted("Name", true, false);
		Then.onTheAppUnderTestMDCTable.iShouldNotSeeTheColumnMenu();
	});

	opaTest("Group with column menu quick action", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iPressOnColumnHeader("Category");
		Then.onTheAppUnderTestMDCTable.iShouldSeeOneColumnMenu();
		When.onTheAppUnderTestMDCTable.iUseColumnMenuQuickGroup({key: "Category", grouped: true});
		//Then.onTheAppUnderTestMDCTable.iShouldSeeGroupConditions({groupLevels: [{name: "Category"}]});
		Then.onTheAppUnderTestMDCTable.iShouldNotSeeTheColumnMenu();
	});

	opaTest("Sort with column menu item", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iPressOnColumnHeader("Category");
		Then.onTheAppUnderTestMDCTable.iShouldSeeOneColumnMenu();
		When.onTheAppUnderTestMDCTable.iPressOnColumnMenuItem(Util.P13nDialogInfo.Titles.sort);
		Then.onTheAppUnderTestMDCTable.iShouldSeeColumnMenuItemContent(Util.P13nDialogInfo.Titles.sort);
		//Then.onTheAppUnderTestMDCTable.iShouldSeeP13nSortItems([
		//	{p13nItem: "Category", sorted: true, descending: false}
		//]);
		//When.onTheAppUnderTestMDCTable.iRemoveSorting();
		When.onTheAppUnderTestMDCTable.iPressConfirmInColumnMenuItemContent();
		Then.onTheAppUnderTestMDCTable.iShouldNotSeeTheColumnMenu();
		//Then.onTheAppUnderTestMDCTable.iShouldSeeColumnSorted("Category", false, false);
		When.onTheAppUnderTestMDCTable.iPressOnColumnHeader("Category");
		Then.onTheAppUnderTestMDCTable.iShouldSeeOneColumnMenu();
		Then.onTheAppUnderTestMDCTable.iShouldSeeColumnMenuQuickSort({key: "Category", label: "Category", sortOrder: coreLibrary.SortOrder.Ascending});
		Then.onTheAppUnderTestMDCTable.iShouldSeeColumnMenuQuickGroup({key: "Category", label: "Category", grouped: true});
	});

	opaTest("Reset p13n changes", function(Given, When, Then) {
		//When.onTheAppUnderTestMDCTable.iUseColumnMenuQuickSort({key: "Category", sortOrder: coreLibrary.SortOrder.Ascending});
		//When.onTheAppUnderTestMDCTable.iPressOnColumnHeader("Category");
		Then.onTheAppUnderTestMDCTable.iShouldSeeOneColumnMenu();
		When.onTheAppUnderTestMDCTable.iPressOnColumnMenuItem(Util.P13nDialogInfo.Titles.sort);
		When.onTheAppUnderTestMDCTable.iPressResetInColumnMenuItemContent();
		When.onTheAppUnderTestMDCTable.iNavigateBackFromColumnMenuItemContent();
		Then.onTheAppUnderTestMDCTable.iShouldSeeColumnMenuQuickSort({key: "Category", label: "Category", sortOrder: coreLibrary.SortOrder.None});
		Then.onTheAppUnderTestMDCTable.iShouldSeeColumnMenuQuickGroup({key: "Category", label: "Category", grouped: true});
	});

	opaTest("Close column menu", function(Given, When, Then) {
		When.onTheAppUnderTestMDCTable.iCloseTheColumnMenu();
		Then.onTheAppUnderTestMDCTable.iShouldNotSeeTheColumnMenu();

		// Teardown
		Then.onTheAppUnderTestMDCTable.iTeardownMyAppFrame();
	});
});