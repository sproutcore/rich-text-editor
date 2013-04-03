/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SC */
SproutCoreWysiwyg = SC.Object.create(
/** @scope SproutcoreWysiwyg.prototype */
{

	NAMESPACE: 'SproutcoreWysiwyg',
	VERSION: '1.0.2',

	styles: [ {
		value: 'p',
		title: 'Paragraph',
		keyEquivalent: 'alt_ctrl_0',
		height: 28,
		action: 'formatBlock'
	}, {
		value: 'h1',
		title: '<h1>Heading 1</h1>',
		keyEquivalent: 'alt_ctrl_1',
		height: 40,
		action: 'formatBlock'
	}, {
		value: 'h2',
		title: '<h2>Heading 2</h2>',
		keyEquivalent: 'alt_ctrl_2',
		height: 36,
		action: 'formatBlock'
	}, {
		value: 'h3',
		title: '<h3>Heading 3</h3>',
		keyEquivalent: 'alt_ctrl_3',
		height: 34,
		action: 'formatBlock'
	}, {
		value: 'h4',
		title: '<h4>Heading 4</h4>',
		keyEquivalent: 'alt_ctrl_4',
		height: 30,
		action: 'formatBlock'
	}, {
		value: 'h5',
		title: '<h5>Heading 5</h5>',
		keyEquivalent: 'alt_ctrl_5',
		height: 25,
		action: 'formatBlock'
	}, {
		value: 'h6',
		title: '<h6>Heading 6</h6>',
		keyEquivalent: 'alt_ctrl_6',
		height: 24,
		action: 'formatBlock'
	} ],

	beautifyShortcut: function (shortcut) {
		if (shortcut) {
			if (SC.browser.isMac) {
			  shortcut = shortcut.replace('ctrl_', '⌘');
			  shortcut = shortcut.replace('shift_', '⇧');
			  shortcut = shortcut.replace('alt_', '⌥');
			}
			else {
			  shortcut = shortcut.replace('ctrl_', 'Ctrl+');
			  shortcut = shortcut.replace('shift_', 'Shift+');
			  shortcut = shortcut.replace('alt_', 'Alt+');
			}
		}
		return shortcut;
	},

});

// Firefox: Disable image resizing
document.execCommand("enableObjectResizing", false, false);

