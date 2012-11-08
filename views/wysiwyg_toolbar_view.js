// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
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
