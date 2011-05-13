/* 
 * init.js (PagePreview)
 * ------------------------------
 * Application init script, creates more App specific methods and abstractions.
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-17
 * Changed: 2011-05-13
 */

!(function _init_wrap( win, doc, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRapps = IR.apps = IR.apps || { },
		IRcomponents = IR.components = IR.components || { },
		Core = IRcomponents.Core,

	PagePreview = (function _PagePreview() {
		var	Public				= { },
			Private				= {
				// object to store Template Toolkit passed data
				TemplateToolkit: win.TemplateToolkit || { },
				isJSON:	/^(?:\{.*\}|\[.*\])$/	// JSON validation regex
			};

		Public.name				= 'InterRed Seitenvorschau';
		Public.version			= 0.6;
	
		// copy and shortcut some native methods
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
						Private.TemplateToolkit[ key ] = Private.isJSON.test( arg[ key ] ) ? JSON.parse( arg[ key ] ) : arg[ key ]; 
					});
				}
				else if( typeof arg === 'string' && typeof arguments[ 1 ] === 'string' ) {
					var value = arguments[ 1 ];
					Private.TemplateToolkit[ arg ] = Private.isJSON.test( value ) ? JSON.parse( value ) : value;
				}
				else { 
					throw new TypeError( 'addTTvar: wrong arguments' );
				}
			}
		};

		// get a Template Toolkit variable, create a shortcut method aswell
		Public.getTTvar			= Public.T = function _getTTvar( key ) {
			return Private.TemplateToolkit[ key ];
		};

		// also, expose the data container directly (TODO: reconsider this.)
		Public.TT				= Private.TemplateToolkit;
		
		// createCSS returns a cross-browser compatible CSS string. For instance, .createCSS('boxShadow') returns "MozBoxShadow" in FF<4 while in WebKit browsers the result is just "boxShadow"
		Public.createCSS = (function _createCSS() {
			var div				= doc.createElement('div'),
				divStyle		= div.style,
				ret				= null,
				cache			= { };
	
			return function _createCSSClosure( name ) {
				if( name in cache ) { return cache[ name ]; }
	
				for( var prop in divStyle ) {
					if( prop.toLowerCase() === name.toLowerCase() ) {
						cache[ name ] = prop;
						return prop;
					}
				}
	
				'Moz Webkit ms O'.split(' ').some(function _some( prefix ) {
					ret = prefix + name;
	
					if( name in divStyle ) {
						ret = cache[ name ] = name;
						return true;
					}
	
					if( ret in divStyle ) {
						cache[ name ] = ret;
						return true;
					}
	
					for( var prop in divStyle ) {
						if( prop.toLowerCase() === ret.toLowerCase() ) {
							ret = cache[ name ] = prop;
							return true;
						}
					}
	
					ret = null;
				});
	
				return ret;
			};
		}());

		return Public;
	}());

	if( Core ) {
		Core.registerApplication( IRapps.PagePreview = PagePreview );
	}
	else {
		throw new TypeError( 'PagePreview init: Core not available - aborting.' );
	}
}( window, window.document ));