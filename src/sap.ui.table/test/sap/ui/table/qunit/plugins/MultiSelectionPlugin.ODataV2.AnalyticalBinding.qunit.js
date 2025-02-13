/*global QUnit */

sap.ui.define([
	"sap/ui/table/qunit/TableQUnitUtils",
	"sap/ui/table/plugins/MultiSelectionPlugin",
	"sap/ui/table/AnalyticalTable",
	"sap/ui/table/AnalyticalColumn",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/Core",
	"sap/ui/core/qunit/analytics/o4aMetadata",
	"sap/ui/core/qunit/analytics/TBA_ServiceDocument", // provides mock data
	"sap/ui/core/qunit/analytics/ATBA_Batch_Contexts" // provides mock data
], function(
	TableQUnitUtils,
	MultiSelectionPlugin,
	AnalyticalTable,
	AnalyticalColumn,
	ODataModel,
	Core,
	o4aFakeService
) {
	"use strict";

	var sServiceURI = "http://o4aFakeService:8080/";

	o4aFakeService.fake({
		baseURI: sServiceURI
	});

	function createResponseData(iSkip, iTop, iCount) {
		var sRecordTemplate = "{\"__metadata\":{\"uri\":\"http://o4aFakeService:8080/ActualPlannedCostsResults('{index}')\","
							  + "\"type\":\"tmp.u012345.cca.CCA.ActualPlannedCostsResultsType\"},\"CostCenter\":\"CostCenter-{index}\"}";
		var aRecords = [];
		var sCount = iCount != null ? ",\"__count\":\"" + iCount + "\"" : "";

		for (var i = iSkip, iLastIndex = iSkip + iTop; i < iLastIndex; i++) {
			aRecords.push(sRecordTemplate.replace(/({index})/g, i));
		}

		return "{\"d\":{\"results\":[" + aRecords.join(",") + "]" + sCount + "}}";
	}

	function createResponse(iSkip, iTop, iCount, bGrandTotal) {
		var sCountResponse =
			iCount != null
				? "--AAD136757C5CF75E21C04F59B8682CEA0\r\n" +
				  "Content-Type: application/http\r\n" +
				  "Content-Length: 131\r\n" +
				  "content-transfer-encoding: binary\r\n" +
				  "\r\n" +
				  "HTTP/1.1 200 OK\r\n" +
				  "Content-Type: application/json\r\n" +
				  "content-language: en-US\r\n" +
				  "Content-Length: 35\r\n" +
				  "\r\n" +
				  "{\"d\":{\"results\":[],\"__count\":\"" + iCount + "\"}}\r\n"
				: "";

		var sGrandTotalResponse =
			bGrandTotal
				? "--AAD136757C5CF75E21C04F59B8682CEA0\r\n" +
				  "Content-Type: application/http\r\n" +
				  "Content-Length: 406\r\n" +
				  "content-transfer-encoding: binary\r\n" +
				  "\r\n" +
				  "HTTP/1.1 200 OK\r\n" +
				  "Content-Type: application/json\r\n" +
				  "content-language: en-US\r\n" +
				  "Content-Length: 309\r\n" +
				  "\r\n" +
				  "{\"d\":{\"results\":[{\"__metadata\":{\"uri\":\"http://o4aFakeService:8080/ActualPlannedCostsResults(\'142544452006589331\')\","
				  + "\"type\":\"tmp.u012345.cca.CCA.ActualPlannedCostsResultsType\"},\"CostCenter\":\"CostCenter\"}],\"__count\":\"1\"}}\r\n"
				: "";

		return sCountResponse +
			   sGrandTotalResponse +
			   "--AAD136757C5CF75E21C04F59B8682CEA0\r\n" +
			   "Content-Type: application/http\r\n" +
			   "Content-Length: 3113\r\n" +
			   "content-transfer-encoding: binary\r\n" +
			   "\r\n" +
			   "HTTP/1.1 200 OK\r\n" +
			   "Content-Type: application/json\r\n" +
			   "content-language: en-US\r\n" +
			   "Content-Length: 3015\r\n" +
			   "\r\n" +
			   createResponseData(iSkip, iTop, iCount) + "\r\n" +
			   "--AAD136757C5CF75E21C04F59B8682CEA0--\r\n" +
			   "";
	}

	o4aFakeService.addResponse({
		batch: true,
		uri: [
			"ActualPlannedCosts(P_ControllingArea='US01',P_CostCenter='100-1000',P_CostCenterTo='999-9999')"
			+ "/Results?$select=CostCenter&$top=0&$inlinecount=allpages",
			"ActualPlannedCosts(P_ControllingArea='US01',P_CostCenter='100-1000',P_CostCenterTo='999-9999')"
			+ "/Results?$select=CostCenter&$top=110&$inlinecount=allpages"
		],
		header: o4aFakeService.headers.BATCH,
		content: createResponse(0, 110, 200)
	});

	o4aFakeService.addResponse({
		batch: true,
		uri: [
			"ActualPlannedCosts(P_ControllingArea='US01',P_CostCenter='100-1000',P_CostCenterTo='999-9999')"
			+ "/Results?$select=CostCenter&$skip=110&$top=90"
		],
		header: o4aFakeService.headers.BATCH,
		content: createResponse(110, 90)
	});

	o4aFakeService.addResponse({
		batch: true,
		uri: [
			"ActualPlannedCosts(P_ControllingArea='US01',P_CostCenter='100-1000',P_CostCenterTo='999-9999')"
			+ "/Results?$select=CostCenter&$skip=110&$top=80"
		],
		header: o4aFakeService.headers.BATCH,
		content: createResponse(110, 80)
	});

	TableQUnitUtils.setDefaultSettings({
		plugins: [new MultiSelectionPlugin()],
		rows: {
			path: "/ActualPlannedCosts(P_ControllingArea='US01',P_CostCenter='100-1000',P_CostCenterTo='999-9999')/Results"
		},
		columns: new AnalyticalColumn({
			leadingProperty: "CostCenter",
			template: new TableQUnitUtils.TestControl({text: {path: "CostCenter"}})
		}),
		models: new ODataModel(sServiceURI)
	});

	QUnit.module("Load data", {
		beforeEach: function() {
			this.oTable = TableQUnitUtils.createTable(AnalyticalTable);
			this.oMultiSelectionPlugin = this.oTable.getPlugins()[0];
			return this.oTable.qunit.whenBindingChange().then(this.oTable.qunit.whenRenderingFinished);
		},
		afterEach: function() {
			this.oTable.destroy();
		}
	});

	QUnit.test("Select all", function(assert) {
		this.oMultiSelectionPlugin.setLimit(0);
		Core.applyChanges();

		return this.oMultiSelectionPlugin.selectAll().then(function() {
			var oBinding = this.oTable.getBinding();
			var iBindingLength = oBinding.getLength();
			var aContexts = oBinding.getContexts(0, iBindingLength, 0, true);

			assert.equal(aContexts.length, iBindingLength, "All binding contexts are available");
			assert.ok(!aContexts.includes(undefined), "There are no undefined contexts");
		}.bind(this));
	});

	QUnit.test("Select range", function(assert) {
		return this.oMultiSelectionPlugin.setSelectionInterval(0, 189).then(function() {
			var aContexts = this.oTable.getBinding().getContexts(0, 190, 0, true);

			assert.equal(aContexts.length, 190, "Binding contexts in selected range are available");
			assert.ok(!aContexts.includes(undefined), "There are no undefined contexts");
		}.bind(this));
	});
});