/* 
 * core_plugin_ajax.js
 * ------------------------------
 * Core plugin: Ajax communication (jQuery abstaction level)
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-05-04
 */
 
!(function _core_plugin_ajax_wrap( win ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { };

	if( Object.hasKeys( IRcomponents, 'Core' ) ) {
		var Core = IRcomponents.Core;
		
		Core.plugin(function _plugin( win, doc, $, Private, Public, Sandbox, PagePreview, undef ) {
			/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.0 ******** *******/
			/****** ************************************************** *******/
			var TT	= PagePreview.TT;
			
			Public.request = function _request( params ) {
				params = params || { };
				
				return $.ajax({
					url:		params.url			|| TT.serverscript,
					type:		params.type			|| 'POST',
					dataType:	params.dataType		|| 'json',
					beforeSend:	params.beforeSend	|| $.noop,
					data:		$.extend({
						sid:	TT.sid,
						rm:		params.rm		|| ''
					}, params.data || { } ),
					success:	params.success		|| $.noop,
					error:		params.error		|| $.noop,
					complete:	params.complete		|| $.noop
				});
			};
		});
	}
	else {
		throw new ReferenceError( 'Plugin: Ajax -> Core not found.' ); 
	}
	
}( window ));
