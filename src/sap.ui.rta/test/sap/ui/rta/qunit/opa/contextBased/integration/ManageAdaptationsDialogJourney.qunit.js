/* global QUnit */
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"sap/ui/test/Opa5",
		"./pages/contextBased/ManageAdaptationsDialog",
		"./pages/contextBased/SaveContextBasedAdaptationDialog",
		"./pages/contextBased/EditAdaptationDialog",
		"./pages/contextVisibility/ContextsDialog",
		"./pages/contextVisibility/ContextSharingVisibilityFragment",
		"./pages/AppPage",
		"sap/ui/core/date/UI5Date"
	],
	function(opaTest, Opa5) {
		"use strict";

		var arrangements = new Opa5({
			iStartMyApp: function() {
				return this.iStartMyAppInAFrame("test-resources/sap/ui/rta/qunit/opa/contextBased/index.html");
			}
		});

		Opa5.extendConfig({
			arrangements: arrangements,
			autoWait: true
		});

		/*var testData = {
			newAdaptation: {
				title: "New App Context Title",
				description: "New App Context description"
			},
			editAdaptation: {
				title: "Edited app context title",
				description: "Edited app context description"
			}
		};*/
		var oDropBefore = { before: true };
		var oDropAfter = { after: true };

		function testPriorityOfAdaptations(Then, aContextBasedAdaptations) {
			for (var i = 0; i < aContextBasedAdaptations.length; i++) {
				Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(i, aContextBasedAdaptations[i]);
			}
		}

		function testLanguageDependentDateFormat(Then, sExpectedFormat, iColumnRow, sPropertyPath) {
			var sCurrentLanguage = sap.ui.getCore().getConfiguration().getLanguage().toLocaleLowerCase();
			// This opa test will only be executed if the browser language is english
			if (sCurrentLanguage === "en") {
				Then.onTheManageAdaptationsDialogPage.iShouldSeeCorrectDateFormat(sExpectedFormat, iColumnRow, sPropertyPath);
			}
		}

		// Show the demo page with one button to open the manage adaptations dialog
		QUnit.module("Demo Page");
		opaTest("Should open Manage Adaptations Dialog via demo page button", function(Given, When, Then) {
			Given.iStartMyApp();
			Then.onTheDemoAppPage.iShouldSeeManageAdaptationsDialogButton();
			When.onTheDemoAppPage.iClickOnOpenManageAdaptationsDialogButton();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeManageContextBasedAdaptationDialogIsOpend();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeSaveButtonEnabled(false);
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAllExpectedColumnHeaders(6);
			testLanguageDependentDateFormat(Then, "May 25, 2022", 0, "createdBy");
			testLanguageDependentDateFormat(Then, "Sep 7, 2022", 1, "changedAt");
		});

		QUnit.module("Manage Adaptations Dialog");
		opaTest("Should switch order of first and second row", function(Give, When, Then) {
			Then.onTheManageAdaptationsDialogPage.iShouldSeeRows(4);
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(0, "German Admin");
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(1, "DLM Copilot");
			Then.onTheManageAdaptationsDialogPage.iShouldSeeSaveButtonEnabled(false);

			When.onTheManageAdaptationsDialogPage.iSelectAdaptation("DLM Copilot");
			When.onTheManageAdaptationsDialogPage.iMoveAdaptationViaUpButton();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(0, "DLM Copilot");
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(1, "German Admin");
			Then.onTheManageAdaptationsDialogPage.iShouldSeeSaveButtonEnabled(true);
		});

		opaTest("Should switch order of rows back to original position", function(Give, When, Then) {
			Then.onTheManageAdaptationsDialogPage.iShouldSeeRows(4);
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(0, "DLM Copilot");
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(1, "German Admin");
			Then.onTheManageAdaptationsDialogPage.iShouldSeeSaveButtonEnabled(true);

			When.onTheManageAdaptationsDialogPage.iSelectAdaptation("German Admin");
			When.onTheManageAdaptationsDialogPage.iMoveAdaptationViaUpButton();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(0, "German Admin");
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(1, "DLM Copilot");
			Then.onTheManageAdaptationsDialogPage.iShouldSeeSaveButtonEnabled(true);
		});

		opaTest("Should reorder row via drag and drop from last position to third position", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iDragAndDropAdaptation("German Admin", "Spain Admin", oDropAfter);
			testPriorityOfAdaptations(Then, ["DLM Copilot", "England Admin", "Spain Admin", "German Admin"]);
			Then.onTheManageAdaptationsDialogPage.iShouldSeeSaveButtonEnabled(true);
		});

		opaTest("Should reorder row via drag and drop from second position to first position", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iDragAndDropAdaptation("DLM Copilot", "England Admin", oDropAfter);
			testPriorityOfAdaptations(Then, ["England Admin", "DLM Copilot", "Spain Admin", "German Admin"]);
			Then.onTheManageAdaptationsDialogPage.iShouldSeeSaveButtonEnabled(true);
		});

		opaTest("Should reorder row via drag and drop from third position to second position", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iDragAndDropAdaptation("Spain Admin", "DLM Copilot", oDropBefore);
			testPriorityOfAdaptations(Then, ["England Admin", "Spain Admin", "DLM Copilot", "German Admin"]);
			Then.onTheManageAdaptationsDialogPage.iShouldSeeSaveButtonEnabled(true);
		});

		opaTest("Should reorder row via drag and drop from last position to second position", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iDragAndDropAdaptation("German Admin", "Spain Admin", oDropBefore);
			testPriorityOfAdaptations(Then, ["England Admin", "German Admin", "Spain Admin", "DLM Copilot"]);
			Then.onTheManageAdaptationsDialogPage.iShouldSeeSaveButtonEnabled(true);
			When.onTheManageAdaptationsDialogPage.iClickOnCloseButton();
		});

		opaTest("Should open manage context-based adaptation dialog button with error", function(Given, When, Then) {
			When.onTheDemoAppPage.iClickOnManageAdaptationsWithErrorDialogButton();
			Then.onTheDemoAppPage.iShouldSeeErrorDialog();
			When.onTheDemoAppPage.iClickOnCloseDialogButton();
		});
		/**
		 * disabled tests because the used features are part of another BLI and still need to be implemented

		opaTest("Should save new user role specific app context from existing app context", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iClickOnActionMenuOfAdaptationWithTitle("German Admin");
			When.onTheManageAdaptationsDialogPage.iClickOnSaveActionButton();
			Then.onTheAddAdaptationDialogPage.iShouldSeeSaveAddAdaptationDialog();

			When.onTheAddAdaptationDialogPage.iEnterAdaptationTitle(testData.newAdaptation.title);
			Then.onTheAddAdaptationDialogPage.iShouldSeeAdaptationTitle(testData.newAdaptation.title);

			When.onTheAddAdaptationDialogPage.iEnterAdaptationDescription(testData.newAdaptation.description);
			Then.onTheAddAdaptationDialogPage.iShouldSeeAdaptationDescription(testData.newAdaptation.description);

			Then.onTheContextSharingVisibilityFragmentPage.iShouldSeeSelectedRoles("SAP_ACH_ADMIN");
			Then.onTheContextSharingVisibilityFragmentPage.iShouldSeeSelectedRoles("MW_ADMIN");

			When.onTheAddAdaptationDialogPage.iClickOnSave();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(4, testData.newAdaptation.title);
		});

		opaTest("Should edit app context title and description", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iClickOnActionMenuOfAdaptationWithTitle(testData.newAdaptation.title);
			When.onTheManageAdaptationsDialogPage.iClickOnEditActionButton();
			Then.onTheEditAdaptationDialogPage.iShouldSeeEditAdaptationDialog();

			Then.onTheContextSharingVisibilityFragmentPage.iShouldSeeSelectedRoles("SAP_ACH_ADMIN");
			Then.onTheContextSharingVisibilityFragmentPage.iShouldSeeSelectedRoles("MW_ADMIN");

			Then.onTheEditAdaptationDialogPage.iShouldSeeAdaptationTitle(testData.newAdaptation.title);
			When.onTheEditAdaptationDialogPage.iEnterAdaptationTitle(testData.editAdaptation.title);
			Then.onTheEditAdaptationDialogPage.iShouldSeeAdaptationTitle(testData.editAdaptation.title);

			Then.onTheEditAdaptationDialogPage.iShouldSeeAdaptationDescription(testData.newAdaptation.description);
			When.onTheEditAdaptationDialogPage.iEnterAdaptationDescription(testData.editAdaptation.description);
			Then.onTheEditAdaptationDialogPage.iShouldSeeAdaptationDescription(testData.editAdaptation.description);

			When.onTheEditAdaptationDialogPage.iClickOnEdit();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(4, testData.editAdaptation.title);
		});

		opaTest("Should delete penultimate app context out of five app contexts", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iClickOnActionMenuOfAdaptationWithTitle("DLM Copilot");
			When.onTheManageAdaptationsDialogPage.iClickOnDeleteActionButton();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeRows(4);
			testContextBasedAdaptationOrder(Then, ["England Admin", "German Admin", "Spain Admin", testData.editAdaptation.title]);
		});

		opaTest("Should delete second app context out of four app contexts", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iClickOnActionMenuOfAdaptationWithTitle("German Admin");
			When.onTheManageAdaptationsDialogPage.iClickOnDeleteActionButton();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeRows(3);
			testContextBasedAdaptationOrder(Then, ["England Admin", "Spain Admin", testData.editAdaptation.title]);
		});

		opaTest("Should delete second app context out of three app contexts", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iClickOnActionMenuOfAdaptationWithTitle("Spain Admin");
			When.onTheManageAdaptationsDialogPage.iClickOnDeleteActionButton();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeRows(2);
			testContextBasedAdaptationOrder(Then, ["England Admin", testData.editAdaptation.title]);
		});

		opaTest("Should delete first app context out of two app contexts", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iClickOnActionMenuOfAdaptationWithTitle("England Admin");
			When.onTheManageAdaptationsDialogPage.iClickOnDeleteActionButton();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeRows(1);
			testContextBasedAdaptationOrder(Then, [testData.editAdaptation.title]);
		});

		opaTest("Should delete last app contexts", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iClickOnActionMenuOfAdaptationWithTitle(testData.editAdaptation.title);
			When.onTheManageAdaptationsDialogPage.iClickOnDeleteActionButton();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeRows(0);
		});

		opaTest("Should create new app context with user specific roles", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iClickOnNewContextButton();
			Then.onTheAddAdaptationDialogPage.iShouldSeeSaveAdaptationDialog();

			When.onTheAddAdaptationDialogPage.iEnterAdaptationTitle(testData.editAdaptation.title);
			Then.onTheAddAdaptationDialogPage.iShouldSeeAdaptationTitle(testData.editAdaptation.title);

			When.onTheAddAdaptationDialogPage.iEnterAdaptationDescription(testData.editAdaptation.description);
			Then.onTheAddAdaptationDialogPage.iShouldSeeAdaptationDescription(testData.editAdaptation.description);


			Then.onTheContextSharingVisibilityFragmentPage.iShouldSeeSelectedRolesSection();
			When.onTheContextSharingVisibilityFragmentPage.iClickOnAddRoleButton();
			Then.onTheSelectRoleDialogPage.iShouldSeeSelectRoleDialog();
			When.onTheSelectRoleDialogPage.iEnterRoleTitle("/TEST/ROLE/HGWRTS_TST");
			Then.onTheSelectRoleDialogPage.iShouldSeeRoleTitle("/TEST/ROLE/HGWRTS_TST");
			When.onTheSelectRoleDialogPage.iSelectRoleByName("/TEST/ROLE/HGWRTS_TST");
			When.onTheSelectRoleDialogPage.iSelectRoles();
			Then.onTheContextSharingVisibilityFragmentPage.iShouldSeeSelectedRoles("/TEST/ROLE/HGWRTS_TST");

			When.onTheAddAdaptationDialogPage.iClickOnSave();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(0, testData.editAdaptation.title, 1);
		});

		opaTest("Should change user specific assigned roles of newly created app context", function(Give, When, Then) {
			When.onTheManageAdaptationsDialogPage.iClickOnActionMenuOfAdaptationWithTitle(testData.editAdaptation.title);
			When.onTheManageAdaptationsDialogPage.iClickOnEditActionButton();
			Then.onTheEditAdaptationDialogPage.iShouldSeeEditAdaptationDialog();

			Then.onTheContextSharingVisibilityFragmentPage.iShouldSeeSelectedRoles("/TEST/ROLE/HGWRTS_TST");
			When.onTheContextSharingVisibilityFragmentPage.iClickOnRemoveRoleButton("/TEST/ROLE/HGWRTS_TST");
			Then.onTheContextSharingVisibilityFragmentPage.iShouldSeeSelectedRolesSection();
			When.onTheContextSharingVisibilityFragmentPage.iClickOnAddRoleButton();

			Then.onTheSelectRoleDialogPage.iShouldSeeSelectRoleDialog();
			When.onTheSelectRoleDialogPage.iEnterRoleTitle("/TEST/ROLE/BQ_MN6");
			Then.onTheSelectRoleDialogPage.iShouldSeeRoleTitle("/TEST/ROLE/BQ_MN6");
			When.onTheSelectRoleDialogPage.iSelectRoleByName("/TEST/ROLE/BQ_MN6");
			When.onTheSelectRoleDialogPage.iSelectRoles();

			Then.onTheContextSharingVisibilityFragmentPage.iShouldSeeSelectedRoles("/TEST/ROLE/BQ_MN6");
			When.onTheEditAdaptationDialogPage.iClickOnEdit();
			Then.onTheManageAdaptationsDialogPage.iShouldSeeAdaptationAtPosition(0, testData.editAdaptation.title, 1);
			When.onTheManageAdaptationsDialogPage.iClickOnCloseButton();
		});
		 */
	}
);