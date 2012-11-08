// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_base_command');

SC.WYSIWYGCommandFactory = SC.Object.create({

	commandFor: function(key) {
		var klass = this[key];
		return klass ? klass.create() : klass;
	},

	registerCommand: function(klass) {
		if (!klass.prototype.isWYSIWYGCommand) throw new Error("You may only register classes that implement the SC.WYSIWYGCommand mixin");
		this[klass.prototype.commandName] = klass;
	},

	/**
	 * Default commands
	 */

	bold: SC.WYSIWYGBaseCommand.extend({
		commandName: 'bold',
		toolTip: 'Bold text',
		keyEquivalent: 'ctrl_b'
	}),

	italic: SC.WYSIWYGBaseCommand.extend({
		commandName: 'italic',
		toolTip: 'Italicize text',
		keyEquivalent: 'ctrl_i'
	}),

	underline: SC.WYSIWYGBaseCommand.extend({
		commandName: 'underline',
		toolTip: 'Underline text',
		keyEquivalent: 'ctrl_u'
	}),

	insertOrderedList: SC.WYSIWYGBaseCommand.extend({
		commandName: 'insertOrderedList',
		toolTip: 'Insert an ordered list'
	}),

	insertUnorderedList: SC.WYSIWYGBaseCommand.extend({
		commandName: 'insertUnorderedList',
		toolTip: 'Insert an unordered list'
	}),

	justifyLeft: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyLeft',
		toolTip: 'Left justify text',
		keyEquivalent: 'ctrl_['
	}),

	justifyCenter: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyCenter',
		toolTip: 'Center justify text',
		keyEquivalent: 'ctrl_\\'
	}),

	justifyRight: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyRight',
		toolTip: 'Right justify text',
		keyEquivalent: 'ctrl_]'
	}),

	justifyFull: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyFull',
		toolTip: 'Justify text'
	}),

	indent: SC.WYSIWYGBaseCommand.extend({
		commandName: 'indent'
	}),

	outdent: SC.WYSIWYGBaseCommand.extend({
		commandName: 'outdent'
	}),

	styles: SC.WYSIWYGBaseCommand.extend({
		commandName: 'formatBlock',
		toolTile: 'Format text'
	})
});
