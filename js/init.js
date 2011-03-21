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
	win.ir = win.ir || { };
	win.ir.apps = win.ir.apps || { };
	
	var PagePreview = (function _PagePreview() {
		var TemplateToolkit		= { },
			Public				= { },
			Private				= { },
			isJSON				= /^(?:\{.*\}|\[.*\])$/;	// JSON validation regex

		// copy / shortcut some native methods
		Public.toStr			= Object.prototype.toString;
		Public.hasOwn			= Object.prototype.hasOwnProperty;
		Public.type				= Object.type;
		Public.ua				= navigator.userAgent;
		
		// object to store Template Toolkit passed data
		Private.TTData			= { };
				
		// set a Template Toolkit variable
		Public.setTTvar			= function _setTTvar() {
            if( arguments.length ) {
                var arg = arguments[ 0 ];
                if( Public.type( arg ) === 'Object' ) {
                    Object.keys( arg ).forEach(function _forEach( key ) {
						Private.TTData[ key ] = isJSON.test( arg[ key ] ) ? JSON.parse( arg[ key ] ) : arg[ key ]; 
                    });
                }
                else if( typeof arg === 'string' && typeof arguments[ 1 ] === 'string' ) {
					var value = arguments[ 1 ];
					Private.TTData[ arg ] = isJSON.test( value ) ? JSON.parse( value ) : value;
                }
                else { 
                	throw new TypeError( 'addTTvar: wrong arguments' );
                }
            }
        };

		// get a Template Toolkit variable, create a shortcut method aswell
        Public.getTTvar			= Public.TT = function _getTTvar( key ) {
			return Private.TTData[ key ];
        };
        
        // also, expose the data container directly
        Public.TT				= Private.TTData;
        
		
		return Public;
	}());
	
	win.ir.apps.PagePreview = PagePreview;
}(window, window.document));
