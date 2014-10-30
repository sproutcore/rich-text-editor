// ==========================================================================
// Project:   SC.WYSIWYG
// Copyright: ©2010 SproutCore
// ==========================================================================

var pane, editor;

module('SC.WYSIWYGEditorView', {

    setup: function() {

        pane = SC.ControlTestPane.create({
            height: 900,
            childViews: ['editorView', 'otherView'],
            editorView: SC.WYSIWYGEditorView.design(),
            otherView: SC.View.design()
        });

        pane.append(); // make visible so it will have root responder

        // mock the default responder
        SC.RootResponder.responder.defaultResponder = SC.Object.create({
            sendAction: function() {}
        });

    },

    teardown: function() {
        pane.removeAllChildren();
    }

});

test('Editor focuses to / blurs from `firstResponder`', function() {

    var otherView = pane.getPath('otherView');
    SC.run(function() {
        pane.getPath('editorView').focus();
    });

    equals(pane.getPath('editorView.isFirstResponder'), YES, 'The editor `isFirstResponder`');

    SC.run(function() {
        pane.getPath('editorView').blur();
    });

    equals(pane.getPath('editorView.isFirstResponder'), NO, 'The editor is NOT `isFirstResponder`');

});
