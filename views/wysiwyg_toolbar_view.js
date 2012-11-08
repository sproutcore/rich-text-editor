// ==========================================================================
// Project:   SproutCore WYSIWYG 
// Copyright: C 2012 Matygo Education Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js) 
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('delegates/wysiwyg_toolbar_view_delegate');

SC.WYSIWYGToolbarView = SC.ToolbarView.extend(SC.WYSIWYGToolbarViewDelegate, SC.FlowedLayout, {

	classNames: 'sc-wysiwyg-toolbar',

	controller: null,

	flowPadding: {
		top: 4,
		left: 4,
		right: 4
	},

	defaultFlowSpacing: {
		right: 4
	},

	anchorLocation: SC.ANCHOR_TOP,

	commandsBinding: SC.Binding.oneWay('*controller.commands'),

	commandsDidChange: function() {
		var commands = this.get('commands');
		for ( var i = 0; i < commands.length; i++) {
			var view = this.invokeDelegateMethod(this.get('viewDelegate'), 'toolbarViewCreateControlForCommandNamed', this, commands[i]);
			if (view) {
				this.childViews.push(view);
				this.appendChild(view);
			}
		}
	}.observes('commands'),

	delegate: null,

	viewDelegate: function() {
		return this.delegateFor('isWYSIWYGToolbarViewDelegate', this.get('delegate'));
	}.property('delegate')

});
