/* 
 * core_plugin_data.js
 * ------------------------------
 * Core plugin: Data handling (jQuery abstaction level)
 * jQuery data expandos, HTML5 data- Attributes, localStorage & sessionStorage.
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-05-18
 * Changed: 2011-05-18
 */
 
!(function _core_plugin_data_wrap( win ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { };

	if( Object.hasKeys( IRcomponents, 'Core' ) ) {
		var Core = IRcomponents.Core;
		
		Core.plugin(function _plugin( win, doc, $, Private, Public, Sandbox, PagePreview, undef ) {
			/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.1 ******** *******/
			/****** ************************************************** *******/
			Public.data = function( elem, key, value ) {
				var rVal = $.data( elem, key, value );
				
				return value ? this : rVal;
			};
			
			Public.removeData = function( elem, key ) {
				$.removeData( elem, key );
				return this;
			};
			
			Public.hasData = function( elem ) {
				return $.hasData( elem );
			};
		});
	}
	else {
		throw new ReferenceError( 'Plugin: Data -> Core not found.' ); 
	}
	
}( window ));
