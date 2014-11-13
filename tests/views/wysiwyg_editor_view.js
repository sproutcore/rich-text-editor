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

    var _linkOpenedWindow;
    editorView.$('a').on('click', function(e) {
        // If the `mouseDown` returns false, the event
        //  was NOT handled via the view's own responder
        //  Therefore, we can assume the link click opened a
        //  window.
        var evt = SC.Event.create(e);
        _linkOpenedWindow = !editorView.mouseDown(evt);
    }.bind(editorView));

    // We turn off this switch off so that we don't actually open a new window...
    // Of course, this is because we EXPECT to open a window when clicking a link.
    editorView._followRedirects = NO;
    editorView.$('a').trigger('click');

    equals(pane.getPath('editorView.isFirstResponder'), NO, 'The editor is NOT `isFirstResponder`');
    equals(_linkOpenedWindow, YES, 'Clicking the link opened a window.');

    SC.run(function() {
        editorView.focus();
    });

    equals(pane.getPath('editorView.isFirstResponder'), YES, 'The editor `isFirstResponder`');

    // Try the click again when the editer has `isFirstResponder`
    editorView.$('a').trigger('click');

    equals(_linkOpenedWindow, NO, 'Clicking the link did NOT open a window.');

});