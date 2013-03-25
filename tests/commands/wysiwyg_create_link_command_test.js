/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/

describe('SC.WYSIWYGCreateLinkCommand', function() {

	var command = null;

	beforeEach(function() {
		command = SC.WYSIWYGCreateLinkCommand.create();
		editor = SC.WYSIWYGEditorView.create();
	});

	it("Should reset the command when dismissed", function() {
		spyOn(editor, 'restoreSavedSelection');

		command.set('url', "Test");
		command.set('linkText', "Test");

		command.cancelCommand(editor);

		expect(editor.restoreSavedSelection).toHaveBeenCalled();
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

	it("Should grab url values from an existing link", function() {
		spyOn(editor, 'saveSelection');

		// setup a mock return
		spyOn(editor, 'getSelection').andReturn({
			anchorNode: {
				nodeType: 3,
				parentNode: {
					tagName: 'A',
					text: 'yo',
					href: 'http://yo.com'
				}
			}
		});

		// exercise
		command.execute(SC.ButtonView.create(), editor);
		// assert
		expect(editor.saveSelection).toHaveBeenCalled();
		expect(editor.getSelection).toHaveBeenCalled();
		expect(command.get('url')).toEqual('http://yo.com');
		expect(command.get('linkText')).toEqual('yo');
	});

	it("Should grab link text from existing node when not a link", function() {
		spyOn(editor, 'saveSelection');

		// setup a mock return
		spyOn(editor, 'getSelection').andReturn({
			anchorNode: {
				parentNode: {}
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.execute(SC.ButtonView.create(), editor);

		// assert
		expect(editor.saveSelection).toHaveBeenCalled();
		expect(editor.getSelection).toHaveBeenCalled();
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('yo');
	});

	it("Should update an existing link", function() {
		command.set('url', 'http://myLink.com');
		command.set('linkText', 'Test123');

		spyOn(editor, 'restoreSavedSelection');
		spyOn(editor, 'notifyDomValueChange');

		var element = {
			tagName: 'A',
			text: 'yo',
			href: 'http://yo.com'
		};

		// setup a mock return
		spyOn(editor, 'getSelection').andReturn({
			anchorNode: {
				parentNode: element
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.commitCommand(editor);

		expect(element.target).toEqual('_blank');
		expect(element.textContent).toEqual('Test123');
		expect(element.href).toEqual('http://myLink.com');
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

	it("Should create a new link", function() {
		command.set('url', 'http://myLink.com');
		command.set('linkText', 'Test123');

		spyOn(editor, 'restoreSavedSelection');
		spyOn(editor, 'insertHtmlAtCaret');

		// setup a mock return
		spyOn(editor, 'getSelection').andReturn({
			anchorNode: {
				parentNode: {}
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.commitCommand(editor);

		expect(editor.insertHtmlAtCaret).toHaveBeenCalledWith('<a href="http://myLink.com" target="_blank" />Test123</a>');
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

	it("Should support a mailto link when creating a new link", function() {
		command.set('url', 'mailto:joe@learndot.com');
		command.set('linkText', 'Test123');

		spyOn(editor, 'restoreSavedSelection');
		spyOn(editor, 'insertHtmlAtCaret');

		// setup a mock return
		spyOn(editor, 'getSelection').andReturn({
			anchorNode: {
				parentNode: {}
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.commitCommand(editor);

		expect(editor.insertHtmlAtCaret).toHaveBeenCalledWith('<a href="mailto:joe@learndot.com" target="_blank" />Test123</a>');
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

	it("Should support a mailto link when updating a new link", function() {
		command.set('url', 'mailto:joe@learndot.com');
		command.set('linkText', 'Test123');

		spyOn(editor, 'restoreSavedSelection');
		spyOn(editor, 'notifyDomValueChange');

		var element = {
			tagName: 'A',
			text: 'yo',
			href: 'http://yo.com'
		};

		// setup a mock return
		spyOn(editor, 'getSelection').andReturn({
			anchorNode: {
				parentNode: element
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.commitCommand(editor);

		expect(element.target).toEqual('_blank');
		expect(element.textContent).toEqual('Test123');
		expect(element.href).toEqual('mailto:joe@learndot.com');
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

});