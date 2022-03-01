sap.ui.define(['sap/ui/webc/common/thirdparty/base/asset-registries/Themes', 'sap/ui/webc/common/thirdparty/theming/generated/themes/sap_fiori_3/parameters-bundle.css', './sap_fiori_3/parameters-bundle.css'], function (Themes, defaultThemeBase, parametersBundle_css) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

	var defaultThemeBase__default = /*#__PURE__*/_interopDefaultLegacy(defaultThemeBase);

	Themes.registerThemePropertiesLoader("@ui5/webcomponents-theming", "sap_fiori_3", () => defaultThemeBase__default);
	Themes.registerThemePropertiesLoader("@ui5/webcomponents", "sap_fiori_3", () => parametersBundle_css);
	var badgeCss = {packageName:"@ui5/webcomponents",fileName:"themes/Badge.css",content:".ui5-hidden-text{position:absolute;clip:rect(1px,1px,1px,1px);user-select:none;left:-1000px;top:-1000px;pointer-events:none;font-size:0}:host(:not([hidden])){display:inline-block;height:var(--_ui5-badge-height);min-width:1.125em;max-width:100%;padding:0 .3125em;color:var(--sapAccentColor1);background:var(--sapLegendBackgroundColor1);border:var(--_ui5-badge-border);border-inline-start:var(--_ui5-badge-left-border);border-radius:var(--_ui5-badge-border-radius);box-sizing:border-box;font-family:\"72override\",var(--sapFontFamily);font-weight:var(--_ui5-badge-font-weight);text-align:center;letter-spacing:.0125em;transition:all .2s ease-in-out}:host(:not([color-scheme]):hover),:host([color-scheme]:hover){cursor:var(--_ui5-badge-cursor)}.ui5-badge-root{display:flex;align-items:center;width:100%;height:100%;box-sizing:border-box;pointer-events:var(--_ui5_badge_pointer_events)}.ui5-badge-text{width:100%;overflow:hidden;white-space:nowrap;font-weight:inherit;text-overflow:ellipsis;line-height:1;text-transform:var(--_ui5-badge-text-transform);letter-spacing:inherit;font-size:var(--ui5-badge-font-size)}:host(:hover) .ui5-badge-text{cursor:var(--_ui5-badge-cursor)}:host([_icon-only]){padding:0 .1875em}::slotted([ui5-icon]){width:.75em;height:.75em;min-width:.75em;min-height:.75em;color:inherit}[ui5-badge] [ui5-icon][slot=icon]{display:flex}:host([_has-icon]) .ui5-badge-text{padding-left:.125em}:host([_has-icon]) .ui5-badge-root[dir=rtl] .ui5-badge-text{padding-left:0;padding-right:.125em}:host([color-scheme=\"1\"]){background-color:var(--ui5-badge-color-scheme-1-background);border-color:var(--ui5-badge-color-scheme-1-border);color:var(--ui5-badge-color-scheme-1-color)}:host([color-scheme=\"1\"]:hover){background-color:var(--ui5-badge-color-scheme-1-hover-background);box-shadow:var(--ui5-badge-color-scheme-1-shadow)}:host([active][color-scheme=\"1\"]:hover){box-shadow:var(--ui5-badge-color-scheme-1-active-shadow);color:var(--ui5-badge-color-scheme-1-active-color)}:host([color-scheme=\"2\"]){background-color:var(--ui5-badge-color-scheme-2-background);border-color:var(--ui5-badge-color-scheme-2-border);color:var(--ui5-badge-color-scheme-2-color)}:host([color-scheme=\"2\"]:hover){background-color:var(--ui5-badge-color-scheme-2-hover-background);box-shadow:var(--ui5-badge-color-scheme-2-shadow)}:host([active][color-scheme=\"2\"]:hover){box-shadow:var(--ui5-badge-color-scheme-2-active-shadow);color:var(--ui5-badge-color-scheme-2-active-color)}:host([color-scheme=\"3\"]){background-color:var(--ui5-badge-color-scheme-3-background);border-color:var(--ui5-badge-color-scheme-3-border);color:var(--ui5-badge-color-scheme-3-color)}:host([color-scheme=\"3\"]:hover){background-color:var(--ui5-badge-color-scheme-3-hover-background);box-shadow:var(--ui5-badge-color-scheme-3-shadow)}:host([active][color-scheme=\"3\"]:hover){box-shadow:var(--ui5-badge-color-scheme-3-active-shadow);color:var(--ui5-badge-color-scheme-3-active-color)}:host([color-scheme=\"4\"]){background-color:var(--ui5-badge-color-scheme-4-background);border-color:var(--ui5-badge-color-scheme-4-border);color:var(--ui5-badge-color-scheme-4-color)}:host([color-scheme=\"4\"]:hover){background-color:var(--ui5-badge-color-scheme-4-hover-background);box-shadow:var(--ui5-badge-color-scheme-4-shadow)}:host([active][color-scheme=\"4\"]:hover){box-shadow:var(--ui5-badge-color-scheme-4-active-shadow);color:var(--ui5-badge-color-scheme-4-active-color)}:host([color-scheme=\"5\"]){background-color:var(--ui5-badge-color-scheme-5-background);border-color:var(--ui5-badge-color-scheme-5-border);color:var(--ui5-badge-color-scheme-5-color)}:host([color-scheme=\"5\"]:hover){background-color:var(--ui5-badge-color-scheme-5-hover-background);box-shadow:var(--ui5-badge-color-scheme-5-shadow)}:host([active][color-scheme=\"5\"]:hover){box-shadow:var(--ui5-badge-color-scheme-5-active-shadow);color:var(--ui5-badge-color-scheme-5-active-color)}:host([color-scheme=\"6\"]){background-color:var(--ui5-badge-color-scheme-6-background);border-color:var(--ui5-badge-color-scheme-6-border);color:var(--ui5-badge-color-scheme-6-color)}:host([color-scheme=\"6\"]:hover){background-color:var(--ui5-badge-color-scheme-6-hover-background);box-shadow:var(--ui5-badge-color-scheme-6-shadow)}:host([active][color-scheme=\"6\"]:hover){box-shadow:var(--ui5-badge-color-scheme-6-active-shadow);color:var(--ui5-badge-color-scheme-6-active-color)}:host([color-scheme=\"7\"]){background-color:var(--ui5-badge-color-scheme-7-background);border-color:var(--ui5-badge-color-scheme-7-border);color:var(--ui5-badge-color-scheme-7-color)}:host([color-scheme=\"7\"]:hover){background-color:var(--ui5-badge-color-scheme-7-hover-background);box-shadow:var(--ui5-badge-color-scheme-7-shadow)}:host([active][color-scheme=\"7\"]:hover){box-shadow:var(--ui5-badge-color-scheme-7-active-shadow);color:var(--ui5-badge-color-scheme-7-active-color)}:host([color-scheme=\"8\"]){background-color:var(--ui5-badge-color-scheme-8-background);border-color:var(--ui5-badge-color-scheme-8-border);color:var(--ui5-badge-color-scheme-8-color)}:host([color-scheme=\"8\"]:hover){background-color:var(--ui5-badge-color-scheme-8-hover-background);box-shadow:var(--ui5-badge-color-scheme-8-shadow)}:host([active][color-scheme=\"8\"]:hover){box-shadow:var(--ui5-badge-color-scheme-8-active-shadow);color:var(--ui5-badge-color-scheme-8-active-color)}:host([color-scheme=\"9\"]){background-color:var(--ui5-badge-color-scheme-9-background);border-color:var(--ui5-badge-color-scheme-9-border);color:var(--ui5-badge-color-scheme-9-color)}:host([color-scheme=\"9\"]:hover){background-color:var(--ui5-badge-color-scheme-9-hover-background);box-shadow:var(--ui5-badge-color-scheme-9-shadow)}:host([active][color-scheme=\"9\"]:hover){box-shadow:var(--ui5-badge-color-scheme-9-active-shadow);color:var(--ui5-badge-color-scheme-9-active-color)}:host([color-scheme=\"10\"]){background-color:var(--ui5-badge-color-scheme-10-background);border-color:var(--ui5-badge-color-scheme-10-border);color:var(--ui5-badge-color-scheme-10-color)}:host([color-scheme=\"10\"]:hover){background-color:var(--ui5-badge-color-scheme-10-hover-background);box-shadow:var(--ui5-badge-color-scheme-10-shadow)}:host([active][color-scheme=\"10\"]:hover){box-shadow:var(--ui5-badge-color-scheme-10-active-shadow);color:var(--ui5-badge-color-scheme-10-active-color)}"};

	return badgeCss;

});