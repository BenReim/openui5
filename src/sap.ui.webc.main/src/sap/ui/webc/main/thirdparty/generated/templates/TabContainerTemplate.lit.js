sap.ui.define(['sap/ui/webc/common/thirdparty/base/renderer/LitRenderer'], function (litRender) { 'use strict';

	const block0 = (context, tags, suffix) => litRender.html`<div class="${litRender.classMap(context.classes.root)}" dir="${litRender.ifDefined(context.effectiveDir)}">${ context.tabsAtTheBottom ? block1(context) : undefined }<div class="${litRender.classMap(context.classes.header)}" id="${litRender.ifDefined(context._id)}-header"><div class="ui5-tc__overflow ui5-tc__overflow--start" @click="${context._onOverflowClick}" @keydown="${context._onOverflowKeyDown}" hidden>${ context.startOverflowButton.length ? block4() : block5(context, tags, suffix) }</div><div id="${litRender.ifDefined(context._id)}-tabStrip" class="${litRender.classMap(context.classes.tabStrip)}" role="tablist" @click="${context._onTabStripClick}" @keydown="${context._onTabStripKeyDown}" @keyup="${context._onTabStripKeyUp}">${ litRender.repeat(context.items, (item, index) => item._id || index, (item, index) => block6(item)) }</div><div class="ui5-tc__overflow ui5-tc__overflow--end" @click="${context._onOverflowClick}" @keydown="${context._onOverflowKeyDown}" hidden>${ context.overflowButton.length ? block7() : block8(context, tags, suffix) }</div></div>${ !context.tabsAtTheBottom ? block9(context) : undefined }</div> `;
	const block1 = (context, tags, suffix) => litRender.html`<div class="${litRender.classMap(context.classes.content)}" part="content">${ litRender.repeat(context.items, (item, index) => item._id || index, (item, index) => block2(item)) }</div>`;
	const block2 = (item, index, context, tags, suffix) => litRender.html`${ !item.isSeparator ? block3(item) : undefined }`;
	const block3 = (item, index, context, tags, suffix) => litRender.html`<div class="ui5-tc__contentItem" id="ui5-tc-contentItem-${litRender.ifDefined(item._posinset)}" ?hidden="${item.effectiveHidden}" role="tabpanel" aria-labelledby="${litRender.ifDefined(item._id)}"><slot name="${litRender.ifDefined(item._individualSlot)}"></slot></div>`;
	const block4 = (context, tags, suffix) => litRender.html`<slot name="startOverflowButton"></slot>`;
	const block5 = (context, tags, suffix) => litRender.html`<${litRender.scopeTag("ui5-button", tags, suffix)} icon="${litRender.ifDefined(context.overflowMenuIcon)}" data-ui5-stable="overflow-start" tabindex="-1" tooltip="${litRender.ifDefined(context.overflowMenuTitle)}" aria-haspopup="true" icon-end>${litRender.ifDefined(context._startOverflowText)}</${litRender.scopeTag("ui5-button", tags, suffix)}>`;
	const block6 = (item, index, context, tags, suffix) => litRender.html`${litRender.ifDefined(item.stripPresentation)}`;
	const block7 = (context, tags, suffix) => litRender.html`<slot name="overflowButton"></slot>`;
	const block8 = (context, tags, suffix) => litRender.html`<${litRender.scopeTag("ui5-button", tags, suffix)} icon="${litRender.ifDefined(context.overflowMenuIcon)}" data-ui5-stable="overflow-end" tabindex="-1" tooltip="${litRender.ifDefined(context.overflowMenuTitle)}" aria-haspopup="true" icon-end>${litRender.ifDefined(context._endOverflowText)}</${litRender.scopeTag("ui5-button", tags, suffix)}>`;
	const block9 = (context, tags, suffix) => litRender.html`<div class="${litRender.classMap(context.classes.content)}" part="content">${ litRender.repeat(context.items, (item, index) => item._id || index, (item, index) => block10(item)) }</div>`;
	const block10 = (item, index, context, tags, suffix) => litRender.html`${ !item.isSeparator ? block11(item) : undefined }`;
	const block11 = (item, index, context, tags, suffix) => litRender.html`<div class="ui5-tc__contentItem" id="ui5-tc-contentItem-${litRender.ifDefined(item._posinset)}" ?hidden="${item.effectiveHidden}" role="tabpanel" aria-labelledby="${litRender.ifDefined(item._id)}"><slot name="${litRender.ifDefined(item._individualSlot)}"></slot></div>`;

	return block0;

});