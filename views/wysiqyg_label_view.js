// ==========================================================================
// Project:   SproutCore WYSIWYG 
// Copyright: C 2012 Matygo Education Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js) 
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
