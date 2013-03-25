/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_base_command');
sc_require('controls/wysiwyg_style_view');

SC.WYSIWYGCommandFactory = SC.Object.create({

	commandFor: function(key) {
		var klass = this[key];

		// If it's an uninstantiated view, then attempt to instantiate it.
		if (SC.typeOf(klass) === SC.T_CLASS) {
			klass = this[key] = klass.create();
		}

		return klass;
	},

	registerCommand: function(klass) {
		var instance = klass;

		// If the view isn't instantiated, we need to access the prototype
		if (SC.typeOf(klass) === SC.T_CLASS) instance = klass.prototype;

		if (!instance.isWYSIWYGCommand) throw new Error("You may only register classes that implement the SC.WYSIWYGCommand mixin");
		this[instance.commandName] = klass;
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
		keyEquivalent: 'ctrl_shift_7'
	}),

	insertUnorderedList: SC.WYSIWYGBaseCommand.extend({
		commandName: 'insertUnorderedList',
		title: 'Insert an unordered list',
		keyEquivalent: 'ctrl_shift_8'
	}),

	justifyLeft: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyLeft',
		title: 'Left justify text',
		keyEquivalent: 'ctrl_shift_l'
	}),

	justifyCenter: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyCenter',
		title: 'Center justify text',
		keyEquivalent: 'ctrl_shift_e'
	}),

	justifyRight: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyRight',
		title: 'Right justify text',
		keyEquivalent: 'ctrl_shift_r'
	}),

	justifyFull: SC.WYSIWYGBaseCommand.extend({
		commandName: 'justifyFull',
		title: 'Justify text',
		keyEquivalent: 'ctrl_shift_j'
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
		title: 'Format Text',
		exampleView: SC.WYSIWYGStyleView,
	}),

});
