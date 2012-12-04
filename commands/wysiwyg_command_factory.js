// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
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
		title: 'Bold text',
		keyEquivalent: 'ctrl_b'
	}),

	italic: SC.WYSIWYGBaseCommand.extend({
		commandName: 'italic',
		title: 'Italicize text',
		keyEquivalent: 'ctrl_i'
	}),

	underline: SC.WYSIWYGBaseCommand.extend({
		commandName: 'underline',
		title: 'Underline text',
		keyEquivalent: 'ctrl_u'
	}),

	insertOrderedList: SC.WYSIWYGBaseCommand.extend({
		commandName: 'insertOrderedList',
		title: 'Insert an ordered list',
		keyEquivalent: 'ctrl_shift_o'
	}),

	insertUnorderedList: SC.WYSIWYGBaseCommand.extend({
		commandName: 'insertUnorderedList',
		title: 'Insert an unordered list',
		keyEquivalent: 'ctrl_shift_u'
	}),

	justifyLeft: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyLeft',
		title: 'Left justify text',
		keyEquivalent: 'ctrl_['
	}),

	justifyCenter: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyCenter',
		title: 'Center justify text',
		keyEquivalent: 'ctrl_\\'
	}),

	justifyRight: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyRight',
		title: 'Right justify text',
		keyEquivalent: 'ctrl_]'
	}),

	justifyFull: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyFull',
		title: 'Justify text'
	}),

	indent: SC.WYSIWYGBaseCommand.extend({
		commandName: 'indent',
		title: 'Indent text'
	}),

	outdent: SC.WYSIWYGBaseCommand.extend({
		commandName: 'outdent',
		title: 'Outdent text'
	}),

	styles: SC.WYSIWYGBaseCommand.extend({
		commandName: 'formatBlock',
		title: 'Format Text'
	}),

});
