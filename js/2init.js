/* 
 * init.js (PagePreview)
 * ------------------------------
 * Application init script, creates more App specific methods and abstractions.
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-17
 */
 
!(function _init_wrap( win, doc, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { };
	var IRapps = IR.apps = IR.apps || { };

	var PagePreview = (function _PagePreview() {
		var	Public				= { },
			Private				= {
				// object to store Template Toolkit passed data
				TemplateToolkit: { }
			},
			isJSON				= /^(?:\{.*\}|\[.*\])$/;	// JSON validation regex

		// copy / shortcut some native methods
		Public.toStr			= Object.prototype.toString;
		Public.hasOwn			= Object.prototype.hasOwnProperty;
		Public.type				= Object.type;
		Public.ua				= navigator.userAgent;
				
		// set a Template Toolkit variable
		Public.setTTvar			= function _setTTvar() {
			if( arguments.length ) {
				var arg = arguments[ 0 ];
				if( Public.type( arg ) === 'Object' ) {
					Object.keys( arg ).forEach(function _forEach( key ) {
						Private.TemplateToolkit[ key ] = isJSON.test( arg[ key ] ) ? JSON.parse( arg[ key ] ) : arg[ key ]; 
					});
				}
				else if( typeof arg === 'string' && typeof arguments[ 1 ] === 'string' ) {
					var value = arguments[ 1 ];
					Private.TemplateToolkit[ arg ] = isJSON.test( value ) ? JSON.parse( value ) : value;
				}
				else { 
					throw new TypeError( 'addTTvar: wrong arguments' );
				}
			}
		};

		// get a Template Toolkit variable, create a shortcut method aswell
		Public.getTTvar			= Public.TT = function _getTTvar( key ) {
			return Private.TemplateToolkit[ key ];
		};
        
        // also, expose the data container directly
		Public.TT				= Private.TemplateToolkit;
        
		return Public;
	}());
	
	IRapps.PagePreview = PagePreview;
}( window, window.document ));