// define a root UIComponent which exposes the main view

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	"sap/ui/mdc/tableOpaTests/mockserver/mockServer"
], function(
	/** @type sap.ui.core.UIComponent */ UIComponent,
	/** @type sap.ui.model.v4.ODataModel */ ODataModel,
	/** @type sap.ui.fl.FakeLrepConnectorLocalStorage */ FakeLrepConnectorLocalStorage,
	/** @type mockserver.mockServer */ MockServer) {
	"use strict";

	return UIComponent.extend("sap.ui.mdc.tableOpaTests.appUnderTestMDCTable.Component", {
		metadata: {
			id: "appUnderTestMDCTable",
			manifest: "json"
		},

		init: function() {
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			var oMockServer = new MockServer();
			oMockServer.init();

			var oModel = new ODataModel({
				serviceUrl: "/sap/opu/odata4/IWBEP/V4_SAMPLE/default/IWBEP/V4_GW_SAMPLE_BASIC/0001/",
				groupId: "$direct",
				synchronizationMode: 'None',
				autoExpandSelect: true,
				operationMode: "Server"
			});

			// set model on component
			this.setModel(oModel);

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
		}
	});
});