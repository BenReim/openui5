/*global QUnit*/

sap.ui.define([
	"sap/ui/fl/apply/_internal/flexState/DataSelector",
	"sap/ui/thirdparty/jquery",
	"sap/ui/thirdparty/sinon-4"
], function(
	DataSelector,
	jQuery,
	sinon
) {
	"use strict";
	var sandbox = sinon.createSandbox();

	QUnit.module("Basic functionality", {
		afterEach: function() {
			sandbox.restore();
		}
	}, function() {
		QUnit.test("when a selector is created", function(assert) {
			var oExpectedResult = {
				foo: "bar"
			};
			var oExecuteStub = sandbox.stub().returns(oExpectedResult);
			var oDataSelector = new DataSelector({
				executeFunction: oExecuteStub
			});

			var oActualResult = oDataSelector.get();
			assert.ok(
				oExecuteStub.calledOnce,
				"then the execute function is called for the initial value calculation"
			);
			assert.strictEqual(
				oActualResult,
				oExpectedResult,
				"then the getter returns the result from the execute function"
			);
		});

		QUnit.test("when the getter is called twice", function(assert) {
			var oExecuteStub = sandbox.stub().returns("test");
			var oDataSelector = new DataSelector({
				executeFunction: oExecuteStub
			});
			oDataSelector.get();
			oDataSelector.get();
			assert.ok(
				oExecuteStub.calledOnce,
				"then the value for the second call is returned from the cache"
			);
		});

		QUnit.test("when the selector is invalidated", function(assert) {
			var oExecuteStub = sandbox.stub().returns("test");
			var oDataSelector = new DataSelector({
				executeFunction: oExecuteStub
			});
			oDataSelector.get();
			oDataSelector.checkUpdate();
			oDataSelector.get();
			assert.strictEqual(
				oExecuteStub.callCount,
				2,
				"then the cache is cleared and the execute function is called again"
			);
		});

		QUnit.test("when an update listener is registered", function(assert) {
			var oUpdateStubInitial = sandbox.stub();
			var oUpdatedStubAdded = sandbox.stub();
			var oDataSelector = new DataSelector({
				executeFunction: function() {},
				updateListeners: [oUpdateStubInitial]
			});
			oDataSelector.get();
			assert.ok(
				oUpdateStubInitial.calledOnce,
				"then the listener is called when a new value is calculated"
			);
			oDataSelector.addUpdateListener(oUpdatedStubAdded);
			oDataSelector.checkUpdate();
			assert.strictEqual(
				oUpdateStubInitial.callCount,
				2,
				"then the listener is called again after an invalidation"
			);
			assert.ok(
				oUpdatedStubAdded.calledOnce,
				"then other listeners that were added later are called"
			);
		});

		QUnit.test("when an update listener is added twice", function(assert) {
			var oUpdateStub = sandbox.stub();
			var oDataSelector = new DataSelector({
				executeFunction: function() {},
				updateListeners: [oUpdateStub]
			});
			oDataSelector.addUpdateListener(oUpdateStub);
			oDataSelector.checkUpdate();
			assert.ok(
				oUpdateStub.calledOnce,
				"then the listener is only added and called once"
			);
		});

		QUnit.test("when an update listener is cleaned up", function(assert) {
			var oUpdateStub = sandbox.stub();
			var oDataSelector = new DataSelector({
				executeFunction: function() {},
				updateListeners: [oUpdateStub]
			});
			oDataSelector.removeUpdateListener(oUpdateStub);
			oDataSelector.checkUpdate();
			assert.ok(
				oUpdateStub.notCalled,
				"then the listener is no longer called"
			);
		});

		QUnit.test("when the cache is cleared", function(assert) {
			var oExecuteStub = sandbox.stub().returns("test");
			var oUpdateStub = sandbox.stub();
			var oDataSelector = new DataSelector({
				executeFunction: oExecuteStub
			});
			oDataSelector.get();
			oDataSelector.addUpdateListener(oUpdateStub);
			oDataSelector.clearCachedResult();
			oDataSelector.get();
			assert.strictEqual(
				oExecuteStub.callCount,
				2,
				"then the cache is cleared"
			);
			assert.strictEqual(
				oUpdateStub.callCount,
				2,
				"then update listeners are notified about the reset and after the recalculation"
			);
		});
	});

	QUnit.module("Parameterized selector", {
		beforeEach: function() {
			this.oExpectedResult = {
				foo: {
					bar: "bar"
				},
				baz: "baz"
			};
			this.oExecuteStub = sandbox.stub();
			this.oExecuteStub.callsFake(function(oData, sParameter) {
				return this.oExpectedResult[sParameter];
			}.bind(this));
			this.oDataSelector = new DataSelector({
				executeFunction: this.oExecuteStub,
				parameterKey: "sampleKey"
			});
		},
		afterEach: function() {
			this.oDataSelector.destroy();
			sandbox.restore();
		}
	}, function() {
		QUnit.test("when a parameterized selector is created", function(assert) {
			this.oExecuteStub
				.onFirstCall()
				.callsFake(function(oData, sParameter) {
					assert.strictEqual(
						sParameter,
						"foo",
						"then the execute function is called with the parameter value for the respective getter call"
					);
					return this.oExpectedResult[sParameter];
				}.bind(this));
			assert.strictEqual(
				this.oDataSelector.get({ sampleKey: "foo" }),
				this.oExpectedResult.foo,
				"then the value is returned for the passed key"
			);
		});

		QUnit.test("when the getter is called twice with different parameters", function(assert) {
			this.oDataSelector.get({ sampleKey: "foo" });
			this.oDataSelector.get({ sampleKey: "baz" });
			// Second call with same parameter should return cached result
			this.oDataSelector.get({ sampleKey: "baz" });
			assert.strictEqual(
				this.oExecuteStub.callCount,
				2,
				"then the execute function is called for both values"
			);
		});

		QUnit.test("when the getter is called with an incorrect parameter", function(assert) {
			assert.throws(
				function() {
					this.oDataSelector.get({ someIncorrectKey: "foo" });
				}.bind(this),
				"then an error is thrown"
			);
		});

		QUnit.test("when a parameterized selector is invalidated", function(assert) {
			this.oDataSelector.get({ sampleKey: "foo" });
			this.oDataSelector.get({ sampleKey: "baz" });
			this.oDataSelector.checkUpdate({ sampleKey: "foo" });
			this.oDataSelector.get({ sampleKey: "foo" });
			this.oDataSelector.get({ sampleKey: "baz" });
			assert.strictEqual(
				this.oExecuteStub.callCount,
				3,
				"then only the cache for the provided parameter is cleared"
			);
		});

		QUnit.test("When a parameterized selector is cleared for a specific parameter", function(assert) {
			this.oDataSelector.get({ sampleKey: "foo" });
			this.oDataSelector.get({ sampleKey: "baz" });
			this.oDataSelector.clearCachedResult({ sampleKey: "foo" });
			this.oDataSelector.get({ sampleKey: "foo" });
			this.oDataSelector.get({ sampleKey: "baz" });
			assert.strictEqual(
				this.oExecuteStub.withArgs(undefined, "foo").callCount,
				2,
				"then the cache is cleared for the provided parameter"
			);
			assert.strictEqual(
				this.oExecuteStub.withArgs(undefined, "baz").callCount,
				1,
				"then the cache is not cleared for other parameters"
			);
		});

		QUnit.test("When a parameterized selector is fully cleared", function(assert) {
			this.oDataSelector.get({ sampleKey: "foo" });
			this.oDataSelector.get({ sampleKey: "baz" });
			this.oDataSelector.clearCachedResult();
			this.oDataSelector.get({ sampleKey: "foo" });
			this.oDataSelector.get({ sampleKey: "baz" });
			assert.strictEqual(
				this.oExecuteStub.callCount,
				4,
				"then the cache is cleared for all parameters"
			);
		});
	});

	QUnit.module("Dependent selectors", {
		beforeEach: function() {
			this.oExpectedResult = {
				foo: {
					bar: "bar"
				},
				baz: "baz"
			};

			this.oParentExecuteStub = sandbox.stub();
			this.oParentExecuteStub.callsFake(function(oData, sParameter) {
				return this.oExpectedResult[sParameter];
			}.bind(this));
			this.oParentDataSelector = new DataSelector({
				executeFunction: this.oParentExecuteStub,
				parameterKey: "parentSampleKey"
			});

			this.oExecuteStub = sandbox.stub();
			this.oExecuteStub.callsFake(function(oData, sParameter) {
				return oData[sParameter];
			});
			this.oDataSelector = new DataSelector({
				parentDataSelector: this.oParentDataSelector,
				executeFunction: this.oExecuteStub,
				parameterKey: "sampleKey"
			});
		},
		afterEach: function() {
			this.oDataSelector.destroy();
			this.oParentDataSelector.destroy();
			sandbox.restore();
		}
	}, function() {
		QUnit.test("when a dependent selector is created", function(assert) {
			assert.strictEqual(
				this.oDataSelector.get({
					parentSampleKey: "foo",
					sampleKey: "bar"
				}),
				this.oExpectedResult.foo.bar,
				"then the slector is result is based on the parent result"
			);
			assert.ok(
				this.oParentExecuteStub.calledOnce,
				"then the parent selector calls its execute function if no cached data is available"
			);
		});

		QUnit.test("when the underlying selector is updated", function(assert) {
			var oUpdateStub = sinon.stub();
			this.oDataSelector.addUpdateListener(oUpdateStub);
			this.oParentDataSelector.checkUpdate({
				parentSampleKey: "foo"
			});
			assert.ok(
				oUpdateStub.calledOnce,
				"then the child selector is updated and calls its update listeners"
			);
		});

		QUnit.test("when duplicate parameter names are used", function(assert) {
			var oBrokenChildSelector = new DataSelector({
				parentDataSelector: this.oParentDataSelector,
				executeFunction: function() {},
				parameterKey: "parentSampleKey"
			});
			assert.throws(
				function() {
					oBrokenChildSelector.get();
				},
				"then an error is thrown"
			);
		});

		QUnit.test("when a dependent selector is destroyed", function(assert) {
			var oUpdateSpy = sandbox.spy(DataSelector.prototype, "checkUpdate");
			var oChildSelector = new DataSelector({
				parentDataSelector: this.oParentDataSelector,
				executeFunction: function() {},
				parameterKey: "someOtherKey"
			});

			this.oParentDataSelector.checkUpdate({ parentSampleKey: "foo" });
			oChildSelector.destroy();
			this.oParentDataSelector.checkUpdate({ parentSampleKey: "foo" });
			assert.strictEqual(
				oUpdateSpy.callCount,
				3, // 2 for parent, only one for child
				"then the update listener is deregistered after destruction"
			);
		});
	});

	QUnit.done(function () {
		jQuery("#qunit-fixture").hide();
	});
});