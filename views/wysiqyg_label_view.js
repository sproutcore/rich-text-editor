// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */

/**
 * @class
 * 
 * Simple extension to the SC.LabelView to include the wysiwyg css classes and
 * to remove html escaping.
 * 
 * @extends {SC.LabelView}
 */
SC.WYSIWYGLabelView = SC.LabelView.extend({
	classNames: 'sc-wysiwyg-text',
	escapeHTML: NO
});
