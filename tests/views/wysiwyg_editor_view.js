// ==========================================================================
// Project:   SC.WYSIWYG
// Copyright: ©2010 SproutCore
// ==========================================================================

var pane, editor;

module('SC.WYSIWYGEditorView', {

    setup: function() {

        pane = SC.ControlTestPane.create({
            height: 900,
            childViews: ['editorView'],
            editorView: SC.WYSIWYGEditorView.design()
        });

        // mock the default responder
        SC.RootResponder.responder.defaultResponder = SC.Object.create({
            sendAction: function() {}
        });

    },

    teardown: function() {}

});

test('Editor focuses to / blurs from `firstResponder`', function() {

    SC.run(function() {
        pane.getPath('editorView').focus();
    });

    equals(pane.getPath('editorView.isFirstResponder'), YES, 'The editor `isFirstResponder`');

    SC.run(function() {
        pane.getPath('editorView').blur();
    });

    equals(pane.getPath('editorView.isFirstResponder'), NO, 'The editor is NOT `isFirstResponder`');

});

test('Anchor tag within editor markup', function() {
    var editorView = pane.get('editorView');

    SC.run(function() {
        pane.setPath('editorView.value', '<div><p>So here is <a href="http://www.turnitin.com">the link</a><span>;)</span><p></div>');
    });

    var evt;
    // Doing this just to get a handle on the event object after the view deals with it
    SC.Event.add(editorView.$('a'), 'mousedown', editorView, function(e) {
        editorView.mouseDown(e);
        evt = e;
    });

    // We turn off this switch off so that we don't actually open a new window...
    // Of course, this is because we EXPECT to open a window when clicking a link.
    editorView._followRedirects = NO;

    // Firing off the event directly on the anchor tag should cause the `evt` object to
    //  update with a `evt.originalEvent.cancelled` value of YES or NO
    SC.Event.trigger(editorView.$('a'), 'mousedown');

    equals(pane.getPath('editorView.isFirstResponder'), NO, 'The editor is NOT `isFirstResponder`');

    // Because `evt.preventDefault` should have been called, the view handled this event specially
    equals(evt.originalEvent.cancelled, YES, 'Clicking the link opened a window.');
    equals(evt.hasCustomEventHandling, YES, 'The event went through `evt.preventDefault`.');

    SC.run(function() {
        editorView.focus();
    });

    equals(pane.getPath('editorView.isFirstResponder'), YES, 'The editor `isFirstResponder`');

    // Try the click again when the editer has `isFirstResponder`
    SC.Event.trigger(editorView.$('a'), 'mousedown');

    // Because `evt.allowDefault` should have been called, the view propagated the event.
    equals(evt.originalEvent.cancelled, NO, 'Clicking the link did NOT open a window.');
    equals(evt.hasCustomEventHandling, YES, 'The event went through `evt.allowDefault`.');

    // Just turning the flag back for manual poking/prodding in the SC test runner
    editorView._followRedirects = YES;
});

test('Editor accepts first respondership when enabled', function() {

    var editorView = pane.get('editorView');

    ok(editorView.get('isEnabled'), 'Verify that editor is enabled');
    ok(editorView.get('acceptsFirstResponder'), 'Editor accepts first respondership');
});

test('Editor refuses first respondership when disabled', function() {

    var editorView = pane.get('editorView');

    SC.run(function() {
        editorView.set('isEnabled', false);
    });

    ok(!editorView.get('isEnabled'), 'Verify that editor is not enabled');
    ok(!editorView.get('acceptsFirstResponder'), 'Editor does not accept first respondership');
});
