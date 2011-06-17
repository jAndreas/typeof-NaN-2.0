/* 
 * core_plugin_ajax.js
 * ------------------------------
 * Core plugin: Ajax communication (jQuery abstaction level)
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-17
 */

!(function _core_plugin_ajax_wrap() {
	"use strict";
	
	Object.lookup( 'ir.components.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, PagePreview, undef ) {
		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.1 ******** *******/
		/****** ************************************************** *******/
		var TT	= PagePreview.TT;
		
		Public.request = function _request( params ) {
			if( Object.type( params ) === 'Object' ) {
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
			}
			else {
				Public.error({
					type:	'type',
					origin:	'Core Plugin Ajax',
					name:	'_request()',
					msg:	'Object expected - received "' + win.getLastError() + '" instead'
				});
			}
		};
		
		Public.getJSON = function _getJSON( ) {
			return $.getJSON.apply( null, arguments );
		};
	});
}());
