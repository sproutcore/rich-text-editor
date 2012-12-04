describe('SC.WYSIWYGCreateLinkCommand', function() {

	var command = null;

	beforeEach(function() {
		command = SC.WYSIWYGCreateLinkCommand.create();
		controller = SC.WYSIWYGController.create();
	});

	it("Should reset the the command when dismissed", function() {
		spyOn(controller, 'restoreSavedSelection');

		command.set('url', "Test");
		command.set('linkText', "Test");

		command.cancelCommand(controller);

		expect(controller.restoreSavedSelection).toHaveBeenCalled();
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

	it("Should grab url values from an existing link", function() {
		spyOn(controller, 'saveSelection');

		// setup a mock return
		spyOn(controller, 'getSelection').andReturn({
			anchorNode: {
				parentNode: {
					tagName: 'A',
					text: 'yo',
					href: 'http://yo.com'
				}
			}
		});

		// exercise
		command.execute(SC.ButtonView.create(), controller);

		// assert
		expect(controller.saveSelection).toHaveBeenCalled();
		expect(controller.getSelection).toHaveBeenCalled();
		expect(command.get('url')).toEqual('http://yo.com');
		expect(command.get('linkText')).toEqual('yo');
	});

	it("Should grab link text from existing node when not a link", function() {
		spyOn(controller, 'saveSelection');

		// setup a mock return
		spyOn(controller, 'getSelection').andReturn({
			anchorNode: {
				parentNode: {}
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.execute(SC.ButtonView.create(), controller);

		// assert
		expect(controller.saveSelection).toHaveBeenCalled();
		expect(controller.getSelection).toHaveBeenCalled();
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('yo');
	});

	it("Should update an existing link", function() {
		command.set('url', 'http://myLink.com');
		command.set('linkText', 'Test123');

		spyOn(controller, 'restoreSavedSelection');
		spyOn(controller, 'notifyDomValueChange');

		var element = {
			tagName: 'A',
			text: 'yo',
			href: 'http://yo.com'
		};

		// setup a mock return
		spyOn(controller, 'getSelection').andReturn({
			anchorNode: {
				parentNode: element
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.commitCommand(controller);

		expect(element.target).toEqual('_blank');
		expect(element.textContent).toEqual('Test123');
		expect(element.href).toEqual('http://myLink.com');
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

	it("Should create a new link", function() {
		command.set('url', 'http://myLink.com');
		command.set('linkText', 'Test123');

		spyOn(controller, 'restoreSavedSelection');
		spyOn(controller, 'insertHtmlHtmlAtCaret');

		// setup a mock return
		spyOn(controller, 'getSelection').andReturn({
			anchorNode: {
				parentNode: {}
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.commitCommand(controller);

		expect(controller.insertHtmlHtmlAtCaret).toHaveBeenCalledWith('<a href="http://myLink.com" target="_blank" />Test123</a>');
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

	it("Should support a mailto link when creating a new link", function() {
		command.set('url', 'mailto:joe@learndot.com');
		command.set('linkText', 'Test123');

		spyOn(controller, 'restoreSavedSelection');
		spyOn(controller, 'insertHtmlHtmlAtCaret');

		// setup a mock return
		spyOn(controller, 'getSelection').andReturn({
			anchorNode: {
				parentNode: {}
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.commitCommand(controller);

		expect(controller.insertHtmlHtmlAtCaret).toHaveBeenCalledWith('<a href="mailto:joe@learndot.com" target="_blank" />Test123</a>');
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

	it("Should support a mailto link when updating a new link", function() {
		command.set('url', 'mailto:joe@learndot.com');
		command.set('linkText', 'Test123');

		spyOn(controller, 'restoreSavedSelection');
		spyOn(controller, 'notifyDomValueChange');

		var element = {
			tagName: 'A',
			text: 'yo',
			href: 'http://yo.com'
		};

		// setup a mock return
		spyOn(controller, 'getSelection').andReturn({
			anchorNode: {
				parentNode: element
			},
			toString: function() {
				return 'yo';
			}
		});

		// exercise
		command.commitCommand(controller);

		expect(element.target).toEqual('_blank');
		expect(element.textContent).toEqual('Test123');
		expect(element.href).toEqual('mailto:joe@learndot.com');
		expect(command.get('url')).toEqual('');
		expect(command.get('linkText')).toEqual('');
	});

});