/*
 * ! ${copyright}
 */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/mdc/library",
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Descendant",
	"test-resources/sap/ui/mdc/testutils/opa/table/waitForTable",
	"test-resources/sap/ui/mdc/testutils/opa/table/Actions",
	"test-resources/sap/ui/mdc/qunit/table/OpaTests/pages/Util"
], function(
	/** @type sap.ui.core.Core */ Core,
	/** @type sap.ui.mdc.library */ MdcLibrary,
	/** @type sap.ui.test.Opa5 */ Opa5,
	/** @type sap.ui.test.actions.Press */ Press,
	/** @type sap.ui.test.matchers.PropertyStrictEquals */ PropertyStrictEquals,
	/** @type sap.ui.test.matchers.Ancestor */ Ancestor,
	/** @type sap.ui.test.matchers.Descendant */ Descendant,
	/** @type sap.ui.test.Opa5 */ waitForTable,
	/** @type sap.ui.test.Opa5 */ TablePublicActions,
	/** @type sap.ui.mdc.qunit.table.OpaTests.pages.Util */ Util) {
	"use strict";

	var TableType = MdcLibrary.TableType;

	/**
	 * This Actions are for the internal testing of the MDCTable only!
	 * The public Actions can be found in src/sap/ui/mdc/test/sap/ui/mdc/testutils/opa/table/Actions.js .
	 *
	 * @class Actions
	 * @extends sap.ui.test.Opa5
	 * @private
	 * @alias sap.ui.mdc.qunit.table.OpaTests.pages.Actions
	 */
	return {

		/**
		 * Just look at the screen
		 *
		 * @function
		 * @name iLookAtTheScreen
		 * @return {sap.ui.mdc.qunit.table.OpaTests.pages.Actions} Action object
		 * @private
		 */
		iLookAtTheScreen: function() {
			return this;
		},

		/**
		 * Emulates a click action on the 'Select all' check box to select / deselect all visible rows.
		 * Succeeds only if {@link sap.ui.mdc.Table#multiSelectMode} is set to <code>Default</code>
		 * when using a ResponsiveTable or if {@link sap.ui.table.plugins.MultiSelectionPlugin#limit} is set
		 * to <code>0</code> when using a GridTable.
		 *
		 * @function
		 * @name iClickOnSelectAllCheckBox
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iClickOnSelectAllCheckBox: function(oControl) {
			var sTableId = typeof oControl === "string" ? oControl : oControl.getId();

			return waitForTable.call(this, oControl, {
				success: function(oTable) {
					if (oTable._isOfType(TableType.ResponsiveTable)) {
						return this.waitFor({
							id: sTableId + "-innerTable-sa",
							controlType: "sap.m.CheckBox",
							actions: new Press(),
							errorMessage: "Did not find the 'Select all' checkbox"
						});
					} else {
						var $checkBox = Opa5.getWindow().jQuery("#" + sTableId + "-innerTable-selall");

						return this.waitFor({
							check: function() {
								return $checkBox.length === 1;
							},
							success: function() {
								$checkBox.trigger("click");
							},
							errorMessage: "Did not find the 'Select all' checkbox"
						});
					}
				}
			});
		},

		/**
		 * Emulates a click action on the 'Deselect all' icon to remove the selection on all visible rows.
		 * Succeeds only if {@link sap.ui.mdc.Table#multiSelectMode} is set to <code>ClearAll</code>
		 * when using a ResponsiveTable or if {@link sap.ui.table.plugins.MultiSelectionPlugin#limit} is set
		 * to greater <code>0</code> when using a GridTable.
		 *
		 * @function
		 * @name iClickOnClearAllIcon
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iClickOnClearAllIcon: function(oControl) {
			var sTableId = typeof oControl === "string" ? oControl : oControl.getId();

			return waitForTable.call(this, oControl, {
				success: function(oTable) {
					if (oTable._isOfType(TableType.ResponsiveTable)) {
						return this.waitFor({
							id: sTableId + "-innerTable-clearSelection",
							controlType: "sap.ui.core.Icon",
							actions: new Press(),
							errorMessage: "Did not find the 'Deselect all' icon"
						});
					} else {
						var $checkBox = Opa5.getWindow().jQuery("#" + sTableId + "-innerTable-selall");

						return this.waitFor({
							check: function() {
								return $checkBox.length === 1;
							},
							success: function() {
								$checkBox.trigger("click");
							},
							errorMessage: "Did not find the 'Deselect all' icon"
						});
					}
				}
			});
		},

		/**
		 * Emulates a click action on the check box of one or multiple rows to select them.
		 *
		 * @function
		 * @name iClickOnRowSelectCheckBox
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @param {Number} iStartIndex Index from which the selection starts
		 * @param {Number} iEndIndex Index up to the selection ends
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iClickOnRowSelectCheckBox: function(oControl, iStartIndex, iEndIndex) {
			var sTableId = typeof oControl === "string" ? oControl : oControl.getId();

			return waitForTable.call(this, oControl, {
				success: function(oTable) {
					var iIndex = iStartIndex;
					var oInnerTable = oTable._oTable;

					if (oTable._isOfType(TableType.ResponsiveTable)) {
						for (iIndex; iIndex <= iEndIndex; iIndex++) {
							this.waitFor({
								id: oInnerTable.getItems()[iIndex].getId() + "-selectMulti",
								controlType: "sap.m.CheckBox",
								actions: new Press(),
								errorMessage: "Did not find the check box"
							});
						}
					} else {
						for (iIndex; iIndex <= iEndIndex; iIndex++) {
							Opa5.getWindow().jQuery("#" + sTableId + "-innerTable-rowsel" + iIndex).trigger('click');
						}
					}
				},
				errorMessage: "No table found"
			});
		},

		/**
		 * Performs an Press action on {@type sap.m.SegmentedButtonItem}
		 * 'showDetails' to display hidden columns in the pop-in area.
		 *
		 * @function
		 * @name iPressShowMoreButton
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iPressShowMoreButton: function(oControl) {
			return TablePublicActions.iExpandTableData.call(this, oControl);
		},

		/**
		 * Performs an Press action on {@type sap.m.SegmentedButtonItem}
		 * 'hideDetails' to hide hidden columns from the pop-in area.
		 *
		 * @function
		 * @name iPressShowLessButton
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iPressShowLessButton: function(oControl) {
			return TablePublicActions.iCollapseTableData.call(this, oControl);
		},

		/**
		 * Performs an Press action on {@type sap.m.Button}
		 * 'export-internalSplitBtn-textButton' to start the Excel export.
		 *
		 * @function
		 * @name iPressQuickExportButton
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iPressQuickExportButton: function(oControl) {
			var sTableId = typeof oControl === "string" ? oControl : oControl.getId();

			return this.waitFor({
				id: sTableId + "-export-internalSplitBtn-textButton",
				controlType: "sap.m.Button",
				actions: new Press(),
				errorMessage: "Did not find the 'Export' button"
			});
		},

		/**
		 * Performs an Press action on {@type sap.m.Button}
		 * 'export-internalSplitBtn-arrowButton' that shows up the
		 * additional {@type sap.ui.unified.Menu} with the items
		 * <ul>
		 *     <li>Export</li>
		 *     <li>Export as...</li>
		 * </ul>.
		 *
		 * @function
		 * @name iPressExportMenuButton
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iPressExportMenuButton: function(oControl) {
			var sTableId = typeof oControl === "string" ? oControl : oControl.getId();

			return this.waitFor({
				id: sTableId + "-export-internalSplitBtn-arrowButton",
				controlType: "sap.m.Button",
				actions: new Press(),
				errorMessage: "Did not find the 'Export menu' button"
			});
		},

		/**
		 * Performs an Press action on {@type sap.ui.unified.MenuItem} 'Export'
		 * that is shown up from {@see iPressExportMenuButton}.
		 *
		 * @function
		 * @name iPressExportButtonInMenu
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iPressExportButtonInMenu: function() {
			var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.mdc");

			return this.waitFor({
				controlType: "sap.ui.unified.MenuItem",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: oResourceBundle.getText("table.QUICK_EXPORT")
				}),
				success: function(aMenuItems) {
					new Press().executeOn(aMenuItems[0]);
				},
				errorMessage: "Did not find 'Export' button in menu"
			});
		},

		/**
		 * Performs an Press action on {@type sap.ui.unified.MenuItem} 'Export as...'
		 * that is shown up from {@see iPressExportMenuButton}.
		 *
		 * @function
		 * @name iPressExportAsButtonInMenu
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iPressExportAsButtonInMenu: function() {
			var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.mdc");

			return this.waitFor({
				controlType: "sap.ui.unified.MenuItem",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: oResourceBundle.getText("table.EXPORT_WITH_SETTINGS")
				}),
				success: function(aMenuItems) {
					new Press().executeOn(aMenuItems[0]);
				},
				errorMessage: "Did not find 'Export as...' menu button"
			});
		},

		/**
		 * Fills in the data in the {@type sap.m.Dialog} 'exportSettingsDialog'
		 * that is shown up from {@see iPressExportAsButtonInMenu} and triggers the excel export.
		 *
		 * @function
		 * @name iFillInExportSettingsDialog
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @param {Object} [mSettings] Excel export settings
		 * @param {String} [mSettings.fileName] Optional name for the exported file
		 * @param {String} [mSettings.fileType] Optional type the file should be exported tp XLSX/PDF
		 * @param {Boolean} [mSettings.includeFilterSettings] Optional flag whether to include the filter settings in the exported file
		 * @param {Boolean} [mSettings.splitCells] Optional flag whether to split columns with multiple values
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iFillInExportSettingsDialog: function(oControl, mSettings) {
			return TablePublicActions.iExportToExcel.call(this, oControl, mSettings);
		},

		/**
		 * Changes the {@link sap.ui.mdc.Table#multiSelectMode} property.
		 *
		 * @function
		 * @name iChangeMultiSelectMode
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @param {String} sMode The new value for the multiSelectMode property (Default|ClearAll)
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iChangeMultiSelectMode: function(oControl, sMode) {
			return waitForTable.call(this, oControl, {
				success: function(oTable) {
					oTable.setMultiSelectMode(sMode);
				},
				errorMessage: "No table found"
			});
		},

		/**
		 * Changes the {@link sap.ui.mdc.Table#type} aggregation.
		 *
		 * @function
		 * @name iChangeType
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @param {String} sType The new type for the MDCTable (ResponsiveTable|Table)
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iChangeType: function(oControl, sType) {
			return waitForTable.call(this, oControl, {
				success: function(oTable) {
					oTable.setType(sType);

					oTable._fullyInitialized().then(function() {
						return waitForTable.call(this, oControl, {
							success: function(oTable) {
								Opa5.assert.ok(oTable.getType() === sType, "Table type changed to " + sType);
							},
							errorMessage: "No table found"
						});
					}.bind(this));
				},
				errorMessage: "No table found"
			});
		},

		/**
		 * Changes the {@link sap.ui.table.plugins.MultiSelectionPlugin#limit} property
		 * that is bound to the MDCTable.
		 * Succeeds only if {@link sap.ui.mdc.Table#type} is set to <code>Table</code>.
		 *
		 * @function
		 * @name iChangeLimit
		 * @param {String|sap.ui.mdc.Table} oControl Id or control instance of the MDCTable
		 * @param {Number} iLimit The new value for the limit property
		 * @returns {Promise} OPA waitFor
		 * @private
		 */
		iChangeLimit: function(oControl, iLimit) {
			return waitForTable.call(this, oControl, {
				success: function(oTable) {
					var oInnerTable = oTable._oTable;
					var oSelectionPlugin = oInnerTable.getPlugins()[0];

					oSelectionPlugin.setLimit(iLimit);
				},
				errorMessage: "No table found"
			});
		},

		iPressOnColumnHeader: function(sName, bResponsiveTable){
			var sColumnNameSpace = bResponsiveTable ? "sap.m.Column" : "sap.ui.table.Column";
			var sTableNameSpace = bResponsiveTable ? "sap.m.Table" : "sap.ui.table.Table";
			return this.waitFor({
				searchOpenDialogs: false,
				controlType: sTableNameSpace,
				success: function(aTables) {
					return this.waitFor({
						controlType: "sap.m.Label",
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: sName
							}),
							new Ancestor(aTables[0])
						],
						success: function(aLabels){
							return this.waitFor({
								controlType: sColumnNameSpace,
								matchers: new Descendant(aLabels[0]),
								actions: new Press()
							});
						}
					});
				}
			});
		},

		iCloseTheColumnMenu: function() {
			return Util.waitForColumnMenu.call(this, {
				success: function(oColumnMenu) {
					oColumnMenu.close();
				}
			});
		},

		iUseColumnMenuQuickSort: function(mConfig) {
			return Util.waitForColumnMenu.call(this, {
				success: function(oColumnMenu) {
					this.waitFor({
						controlType: "sap.m.table.columnmenu.QuickSortItem",
						visible: false,
						matchers: [{
							ancestor: oColumnMenu,
							properties: {
								key: mConfig.key
							}
						}],
						success: function(aQuickSortItems) {
							this.waitFor({
								controlType: "sap.m.ToggleButton",
								matchers: [{
									ancestor: aQuickSortItems[0]
								}],
								success: function(aToggleButtons) {
									function pressButton(oButton, bShouldBePressed) {
										if (mConfig.sortOrder === "None" && oButton.getPressed() || bShouldBePressed && !oButton.getPressed()) {
											new Press().executeOn(oButton);
										}
									}

									pressButton(aToggleButtons[0], mConfig.sortOrder === "Ascending");
									pressButton(aToggleButtons[1], mConfig.sortOrder === "Descending");
								},
								errorMessage: "QuickSortItem content is not visible"
							});
						},
						errorMessage: "Column menu QuickSortItem not found"
					});
				}
			});
		},

		iUseColumnMenuQuickGroup: function(mConfig) {
			return Util.waitForColumnMenu.call(this, {
				success: function(oColumnMenu) {
					this.waitFor({
						controlType: "sap.m.table.columnmenu.QuickGroupItem",
						visible: false,
						matchers: [{
							ancestor: oColumnMenu,
							properties: {
								key: mConfig.key
							}
						}],
						success: function(aQuickGroupItems) {
							this.waitFor({
								controlType: "sap.m.ToggleButton",
								matchers: [{
									ancestor: aQuickGroupItems[0].getParent(),
									properties: {
										text: aQuickGroupItems[0].getLabel()
									}
								}],
								success: function(aToggleButtons) {
									if (mConfig.grouped && !aToggleButtons[0].getPressed() || !mConfig.grouped && aToggleButtons[0].getPressed()) {
										new Press().executeOn(aToggleButtons[0]);
									}
								},
								errorMessage: "QuickSortItem content is not visible"
							});
						},
						errorMessage: "Column menu QuickSortItem not found"
					});
				}
			});
		},

		iUseColumnMenuQuickTotal: function(mConfig) {
			return Util.waitForColumnMenu.call(this, {
				success: function(oColumnMenu) {
					this.waitFor({
						controlType: "sap.m.table.columnmenu.QuickTotalItem",
						visible: false,
						matchers: [{
							ancestor: oColumnMenu,
							properties: {
								key: mConfig.key
							}
						}],
						success: function(aQuickTotalItems) {
							this.waitFor({
								controlType: "sap.m.ToggleButton",
								matchers: [{
									ancestor: aQuickTotalItems[0].getParent(),
									properties: {
										text: aQuickTotalItems[0].getLabel()
									}
								}],
								success: function(aToggleButtons) {
									if (mConfig.totaled && !aToggleButtons[0].getPressed() || !mConfig.totaled && aToggleButtons[0].getPressed()) {
										new Press().executeOn(aToggleButtons[0]);
									}
								},
								errorMessage: "QuickTotalItem content is not visible"
							});
						},
						errorMessage: "Column menu QuickTotalItem not found"
					});
				}
			});
		},

		iPressOnColumnMenuItem: function(sLabel) {
			return Util.waitForColumnMenu.call(this, {
				success: function(oColumnMenu) {
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: [{
							ancestor: oColumnMenu,
							properties: {
								title: sLabel
							}
						}],
						actions: new Press(),
						errorMessage: "Column menu item '" + sLabel + "' not found"
					});
				}
			});
		},

		iNavigateBackFromColumnMenuItemContent: function() {
			return Util.waitForColumnMenu.call(this, {
				success: function(oColumnMenu) {
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: [{
							ancestor: oColumnMenu,
							properties: {
								type: "Back"
							}
						}],
						actions: new Press(),
						errorMessage: "Could not navigate back from column menu item content"
					});
				}
			});
		},

		iPressResetInColumnMenuItemContent: function() {
			return Util.waitForColumnMenu.call(this, {
				success: function(oColumnMenu) {
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: [{
							ancestor: oColumnMenu,
							properties: {
								text: Util.getTextFromResourceBundle("sap.m", "table.COLUMNMENU_RESET")
							}
						}],
						actions: new Press(),
						errorMessage: "Colum menu item content could not be reset"
					});
				}
			});
		},

		iPressConfirmInColumnMenuItemContent: function() {
			return Util.waitForColumnMenu.call(this, {
				success: function(oColumnMenu) {
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: [{
							ancestor: oColumnMenu,
							properties: {
								text: Util.getTextFromResourceBundle("sap.m", "table.COLUMNMENU_CONFIRM")
							}
						}],
						actions: new Press(),
						errorMessage: "Colum menu item content could not be confirmed"
					});
				}
			});
		},

		iPressCancelInColumnMenuItemContent: function() {
			return Util.waitForColumnMenu.call(this, {
				success: function(oColumnMenu) {
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: [{
							ancestor: oColumnMenu,
							properties: {
								text: Util.getTextFromResourceBundle("sap.m", "table.COLUMNMENU_CANCEL")
							}
						}],
						actions: new Press(),
						errorMessage: "Colum menu item content could not be canceled"
					});
				}
			});
		}
	};
});