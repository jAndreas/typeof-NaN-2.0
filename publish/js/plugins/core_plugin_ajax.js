/* 
 * core_plugin_ajax.js
 * ------------------------------
 * Core plugin: Ajax communication (jQuery abstaction level)
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-05-30
 */

!(function _core_plugin_ajax_wrap() {
	"use strict";
	
	Object.lookup( 'ir.components.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, PagePreview, undef ) {
		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.1 ******** *******/
		/****** ************************************************** *******/
		var TT	= PagePreview.TT;
		
		Public.request = function _request( params ) {
			Private.verify( this );
			
			params = params || { };
			
			return $.ajax({
				url:		params.url			|| TT.serverscript,
				type:		params.type			|| 'POST',
				dataType:	params.dataType		|| 'json',
				beforeSend:	params.beforeSend	|| $.noop,
				data:		$.extend({
					sid:	TT.sid,
					rm:		params.rm	|| ''
				}, params.data || { } ),
				success:	params.success		|| $.noop,
				error:		params.error		|| $.noop,
				complete:	params.complete		|| $.noop
			});
		};	
	});
}());
