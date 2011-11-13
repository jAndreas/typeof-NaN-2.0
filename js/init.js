/* 
 * init.js (typeofNaN2.0)
 * ------------------------------
 * Application init script, creates more App specific methods, variables and abstractions.
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-11-10
 * Changed: 2011-11-12 - added pathes
 */

!(function _init_wrap( win, doc, undef ) {
	"use strict";
	var	BF = win.BarFoos = win.BarFoos || { },
		BFapps = BF.apps = BF.apps || { },
		Core = BF.Core,

	TypeofNaN = (function _TypeofNaN() {
		var	Public				= { },
			Private				= {
				isJSON:	/^(?:\{.*\}|\[.*\])$/	// JSON validation regex
			};
			
		// copy and shortcut some native methods
		Public.toStr		= Object.prototype.toString;
		Public.hasOwn		= Object.prototype.hasOwnProperty;
		Public.type			= Object.type;
		Public.ua			= navigator.userAgent;
		
		// setup environment pathes
		Public.environment	= {
			jsPath:		'/js/',
			modulePath:	'/js/modules'
		};
		
		Public.name			= 'TypeofNaN 2.0 Website';
		Public.version		= 0.10;
				
		return Public;
	}());

	if( Core ) {
		Core.registerApplication( BFapps.TypeofNaN = TypeofNaN );
	}
	else {
		throw new TypeError( 'typeofNaN2.0 init: BarFoos Core not available - aborting.' );
	}
}( window, window.document ));