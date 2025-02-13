/*!
 * ${copyright}
 */

// Provides the base implementation for all model implementations
sap.ui.define([
	'sap/ui/mdc/field/ConditionsType',
	'sap/ui/mdc/condition/FilterOperatorUtil',
	'sap/ui/mdc/condition/Operator',
	'sap/ui/mdc/condition/Condition',
	'sap/ui/mdc/enum/ConditionValidated',
	'sap/ui/mdc/enum/BaseType',
	'sap/ui/mdc/util/DateUtil',
	'sap/ui/model/SimpleType',
	'sap/ui/model/FormatException',
	'sap/ui/model/ParseException',
	'sap/ui/model/ValidateException',
	'sap/m/library'
],
	function(
		ConditionsType,
		FilterOperatorUtil,
		Operator,
		Condition,
		ConditionValidated,
		BaseType,
		DateUtil,
		SimpleType,
		FormatException,
		ParseException,
		ValidateException,
		mLibrary
		) {
	"use strict";

	/**
	 * Constructor for a <code>ConditionsType</code> to be used in <code>DynamicDateRange</code> control.
	 *
	 * @class
	 * This class represents a type to map an array of conditions used in a {@link sap.ui.mdc.FilterField FilterField} control to a value of a {@link sap.m.DynamicDateRange DynamicDateRange} control.
	 *
	 * @extends sap.ui.mdc.field.ConditionsType
	 *
	 * @author SAP SE
	 * @version ${version}
	 *
	 * @since 1.96.0
	 * @private
	 * @ui5-restricted sap.ui.mdc.field.FieldBase, sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 *
	 * @param {object} [oFormatOptions] Formatting options
	 * @param {sap.ui.model.Type} [oFormatOptions.valueType] Type of the value of the condition (used for formatting and parsing)
	 * @param {string[]} [oFormatOptions.operators] Possible operators to be used in the condition
	 * @param {sap.ui.mdc.enum.FieldDisplay} [oFormatOptions.display] DisplayFormat used to visualize a value
	 * @param {string} [oFormatOptions.fieldHelpID] ID of the field help to determine the key and description // TODO: async request????
	 * @param {boolean} [oFormatOptions.hideOperator] If set, only the value of the condition is shown, but no operator //TODO
	 * @param {int} [oFormatOptions.maxConditions] Maximum number of allowed conditions
	 * @param {sap.ui.model.Context} [oFormatOptions.bindingContext] <code>BindingContext</code> of field. Used to get a key or description from the value help using in/out parameters. (In a table, the value help might be connected to a different row)
	 * @param {sap.ui.model.Type} [oFormatOptions.originalDateType] Type used on field, for example, for date types; a different type is used internally to have different <code>formatOptions</code>
	 * @param {boolean} [oFormatOptions.isUnit] If set, the type is used for the unit part of a field
	 * @param {function} [oFormatOptions.getConditions] Function to get the existing conditions of the field. Only used if <code>isUnit</code> is set. TODO: better solution
	 * @param {function} [oFormatOptions.asyncParsing] Callback function to tell the <code>Field</code> the parsing is asynchronous.
	 * @param {object} [oFormatOptions.navigateCondition] Condition of keyboard navigation. If this is filled, no real parsing is needed as the condition has already been determined and is just returned
	 * @param {object} [oFormatOptions.delegate] Field delegate to handle model-specific logic
	 * @param {object} [oFormatOptions.payload] Payload of the delegate
	 * @param {boolean} [oFormatOptions.preventGetDescription] If set, description is not read by <code>formatValue</code> as it is known that no description exists or might be set later
	 * @param {string} [oFormatOptions.defaultOperatorName] Name of the default <code>Operator</code>
	 * @param {object} [oConstraints] Value constraints
	 * @alias sap.ui.mdc.field.DynamicDateRangeConditionsType
	 */
	var DynamicDateRangeConditionsType = ConditionsType.extend("sap.ui.mdc.field.DynamicDateRangeConditionsType", /** @lends sap.ui.mdc.field.DynamicDateRangeConditionsType.prototype */ {

		constructor : function (oFormatOptions, oConstraints) {
			SimpleType.apply(this, arguments);
			this.sName = "ConditionsDateRange";
			this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
			//TODO: specialConditionDataRangeType if used for tokens in MultiValue FilterField
		}

	});

	DynamicDateRangeConditionsType.prototype.destroy = function() {

		SimpleType.prototype.destroy.apply(this, arguments);

		this._bDestroyed = true;

	};

	DynamicDateRangeConditionsType.prototype.formatValue = function(aConditions, sInternalType) {

		if (aConditions == undefined || aConditions == null || this._bDestroyed) { // if destroyed do nothing
			return null;
		}

		if (!Array.isArray(aConditions)) {
			throw new FormatException("No valid conditions provided");
		}

		var iMaxConditions = _getMaxConditions.call(this);
		var vResult;

		if (iMaxConditions !== 1) {
			throw new FormatException("MaxConditions must be 1");
		}

		if (aConditions.length === 1) {
			var oCondition = aConditions[0];

			var oOperator = FilterOperatorUtil.getOperator(oCondition.operator);
			if (!oCondition.operator || !oOperator) {
				throw new FormatException("No valid condition provided, Operator wrong.");
			}

			var aValues = [];
			var sBaseType = _getBaseType.call(this);
			var sOption = FilterOperatorUtil.getDynamicDateOptionForOperator(oOperator, mLibrary.StandardDynamicDateRangeKeys, sBaseType);

			for (var i = 0; i < oOperator.valueTypes.length; i++) {
				if (oOperator.valueTypes[i] && oOperator.valueTypes[i] !== Operator.ValueType.Static) {
					if (sOption) { // only for standard operators  (dates are needed as local dates)
						if (oOperator.valueTypes[i] === Operator.ValueType.Self) {
							aValues.push(DateUtil.typeToDate(oCondition.values[i], _getValueType.call(this), sBaseType));
						} else {
							var sOperatorBaseType = _getBaseTypeForValueType.call(this, oOperator.valueTypes[i]);
							if (sOperatorBaseType === BaseType.Date || sOperatorBaseType === BaseType.DateTime) {
								aValues.push(DateUtil.typeToDate(oCondition.values[i], _getOperatorType.call(this, oOperator, i), sOperatorBaseType));
							} else {
								aValues.push(oCondition.values[i]); // e.g integer value
							}
						}
					} else {
						aValues.push(oCondition.values[i]); // for custom operators just forward value. (Operator inside handle it)
					}
				}
			}

			if (!sOption) {
				sOption = FilterOperatorUtil.getCustomDynamicDateOptionForOperator(oOperator, sBaseType);
			}

			vResult = {operator: sOption, values: aValues};
		}

		return vResult;

	};

	DynamicDateRangeConditionsType.prototype.parseValue = function(oValue, sInternalType) {

		if (this._bDestroyed) { // if destroyed do nothing
			return null;
		}

		if (_getMaxConditions.call(this) !== 1) {
			throw new ParseException("Only one condition supported for parsing");
		}

		var aOperators = _getOperators.call(this);
		var aConditions = [];
		if (oValue && oValue.operator) {
			if (oValue.operator === "PARSEERROR") {
				throw new ParseException(oValue.values[0]);
			}

			var sOption = oValue.operator; // sOperator is the Option name
			var oOperator = FilterOperatorUtil.getOperatorForDynamicDateOption(sOption, _getBaseType.call(this)); // search via name and alias

			if (oOperator) {
				var sBaseType = _getBaseType.call(this);
				var aValues = [];

				for (var i = 0; i < oOperator.valueTypes.length; i++) {
					if (oOperator.valueTypes[i] && oOperator.valueTypes[i] !== Operator.ValueType.Static) {
						if (mLibrary.StandardDynamicDateRangeKeys[sOption]) { // only for standard operators (dates are returned as local dates)
							if (oOperator.valueTypes[i] === Operator.ValueType.Self) {
								aValues.push(DateUtil.dateToType(oValue.values[i], _getValueType.call(this), sBaseType));
							} else {
								var sOperatorBaseType = oOperator.valueTypes[i] === Operator.ValueType.Self ? sBaseType : _getBaseTypeForValueType.call(this, oOperator.valueTypes[i]);
								if (sOperatorBaseType === BaseType.Date || sOperatorBaseType === BaseType.DateTime) {
									aValues.push(DateUtil.dateToType(oValue.values[i], _getOperatorType.call(this, oOperator, i), sOperatorBaseType));
								} else {
									aValues.push(oValue.values[i]); // e.g integer values
								}
							}
						} else {
							aValues.push(oValue.values[i]); // for custom operators take what comes (inside the Operator already creted te right value)
						}
					}
				}

				var oCondition = Condition.createCondition(oOperator.name, aValues, undefined, undefined, ConditionValidated.NotValidated);
				FilterOperatorUtil.updateConditionValues(oCondition);
				FilterOperatorUtil.checkConditionsEmpty(oCondition, aOperators);
				aConditions.push(oCondition);
			}
		}

		return aConditions;

	};

	DynamicDateRangeConditionsType.prototype.validateValue = function(aConditions) {

		if (aConditions === undefined || aConditions === null || this._bDestroyed) { // if destroyed do nothing
			return;
		}

		if (!Array.isArray(aConditions)) {
			throw new ValidateException("No valid conditions provided");
		}

		var oType = _getValueType.call(this);
		var aOperators = _getOperators.call(this);

		for (var i = 0; i < aConditions.length; i++) {
			var oCondition = aConditions[i];
			if (typeof oCondition !== "object" || !oCondition.operator || !oCondition.values ||
					!Array.isArray(oCondition.values)) {
				throw new ValidateException(this._oResourceBundle.getText("field.VALUE_NOT_VALID"));
			}

			var oOperator = FilterOperatorUtil.getOperator(oCondition.operator);

			if (!oOperator || aOperators.indexOf(oOperator.name) === -1) {
				throw new ValidateException("No valid condition provided, Operator wrong.");
			}

			oOperator.validate(oCondition.values, oType);
		}

	};

	function _getMaxConditions() {

		var iMaxConditions = 1;

		if (this.oFormatOptions.hasOwnProperty("maxConditions")) {
			iMaxConditions = this.oFormatOptions.maxConditions;
		}

		return iMaxConditions;

	}

	function _getValueType() {

		var oType = this.oFormatOptions.valueType;
		if (!oType) {
			throw new Error("Type missing");
		}

		return oType;

	}

	function _getOperators() {

		var aOperators = this.oFormatOptions.operators;
		if (!aOperators || aOperators.length === 0) {
			aOperators = FilterOperatorUtil.getOperatorsForType(_getBaseType.call(this));
		}

		return aOperators;

	}

	function _getBaseType() {

		var oType = _getValueType.call(this);
		var sType = oType.getMetadata().getName();
		var oFormatOptions = oType.getFormatOptions();
		var oConstraints = oType.getConstraints();

		return _getBaseTypeForValueType.call(this, {name: sType, formatOptions: oFormatOptions, constraints: oConstraints});

	}

	function _getBaseTypeForValueType(oValueType) {

		var oDelegate = this.oFormatOptions.delegate;
		var oPayload = this.oFormatOptions.payload;
		var sBaseType = oDelegate ? oDelegate.getTypeUtil(oPayload).getBaseType(oValueType.name, oValueType.formatOptions, oValueType.constraints) : BaseType.Date;

		return sBaseType;

	}

	function _getOperatorType(oOperator, iIndex) {

		return oOperator._createLocalType(oOperator.valueTypes[iIndex]);

	}

	return DynamicDateRangeConditionsType;

});
