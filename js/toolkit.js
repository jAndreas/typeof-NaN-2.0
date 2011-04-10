/* 
 * toolkit.js
 * ------------------------------
 * General initialization of helper methods. Most of the methods here are described in ECMAscript Edition 5. If there is
 * a native version available we just copy that, otherwise we create it here. Some methods are based on https://developer.mozilla.org/en/JavaScript/Reference
 * However, I modified  the code like a lot (some of the methods event created infinite loops in there available form)
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-15
 */

!(function _toolkit_wrap( win, doc, undef ) {
	"use strict";
	
	var ToStr = Object.prototype.toString;
	
	// Date.now()
	Date.now = Date.now || function _now() {
		return ( new Date() ).getTime();
	};
	
	// Object.keys()
	Object.keys = Object.keys || function _keys( o ) {
		var ret=[], p, has = Object.prototype.hasOwnProperty;
	    for( p in o ) {
			if( has.call( o,p ) ) { ret.push( p ); }
		}

	    return ret;
	};
	
	// Object.type() - Non-standard. Returns the [[Class]] property from an object. Returns 'Node' for all HTMLxxxElement objects
	Object.type = function _type( obj ) {
		var res = ToStr.call( obj ).split( ' ' )[ 1 ].replace( ']', '' );
		if( res.indexOf( 'HTML' ) === 0 ) { 
			return 'Node';
		}
		
		return res;
	};
	
	// Object.prototype.hasKeys() - Non-standard. Returns true if all keys are available in an object
	Object.prototype.hasKeys = function( keys ) {
		if( typeof keys === 'string' ) {
			keys = keys.split( /\s/ );
		}
		
		if( Object.type( keys ) === 'Array' ) {
			var that = this;
			return keys.every(function( prop ) {
				return prop in that;
			});
		}
		
		return false;
	};
	
	// Array.prototype.indexOf()
	Array.prototype.indexOf = Array.prototype.indexOf || function _indexOf( search /*, startIndex */ ) {
		if( this === undef || this === null ) { 
			throw new TypeError( 'Array.prototype.indexOf' ); 
		}
			
		var t	= this instanceof Object ? this : new Object( this ),
			len = t.length >>> 0,
			n	= 0,
			k	= 0;
			
		if( !len ) { return -1; }
		
		if( arguments.length > 1 ) {
			n = +arguments[ 1 ];
			if		( n !== n )										{ n = 0; }
			else if	( n !== 0 && n !== (1 / 0) && n !== -(1 / 0) )	{ n = (n > 0 || -1) * (~~( Math.abs( n ) )); }
		}
		
		if( n >= len ) { return -1; }
		
		k = n >= 0 ? n : Math.max( len - Math.abs( n ), 0 );
		
		for( ; k < len; k++ ) {
			if( k in t && t[ k ] === search ) {
				return k;
			}
		}
		return -1;
	};

	// Array.prototype.lastIndexOf()
	Array.prototype.lastIndexOf = Array.prototype.lastIndexOf || function _lastIndexOf( search /*, startIndex */ ) {
		if( this === undef || this === null ) { 
			throw new TypeError( 'Array.prototype.lastIndexOf' ); 
		}
			
		var t	= this instanceof Object ? this : new Object( this ),
			len = t.length >>> 0,
			n	= len,
			k	= 0;
			
		if( !len ) { return -1; }
		
		if( arguments.length > 1 ) {
			n = +arguments[1];
			if		( n !== n )										{ n = 0; }
			else if	( n !== 0 && n !== (1 / 0) && n !== -(1 / 0) )	{ n = (n > 0 || -1) * (~~( Math.abs( n ) )); }
		}
		
		k = n >= 0 ? Math.min( n, len - 1 ) : len - Math.abs( n );
		
		while( k-- ) {
			if( k in t && t[ k ] === search ) {
				return k;
			}
		}
		return -1;
	};
	
	// Array.prototype.filter()
	Array.prototype.filter = Array.prototype.filter || function _filter( fnc /*, thisv */ ) {
		if( this === undef || this === null ) { 
			throw new TypeError('Array.prototype.filter'); 
		}
			
		var t		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			res		= [],
			i		= 0,
			thisv	= arguments[1],
			stored	= null;
			
		if( typeof fnc !== 'function' ) { 
			throw new TypeError('Array.prototype.filter'); 
		}
			
		for(i = 0; i < len; i++) {
			if( i in t ) {
				stored = t[i];
				if( fnc.call(thisv, stored, i, t) ) {
					res.push(stored);
				}
			}
		}
		
		return res;
	};
	
	// Array.prototype.map()
	Array.prototype.map = Array.prototype.map || function _map(fnc /*, thisv */) {
		if( this === undef || this === null ) { 
			throw new TypeError( 'Array.prototype.map' ); 
		}
			
		var t		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			res		= new Array( len ),
			i		= 0,
			thisv	= arguments[ 1 ];
			
		if( typeof fnc !== 'function' )
			throw new TypeError( 'Array.prototype.map' );
			
		for(i = 0; i < len; i++) {
			if( i in t ) {
				res[ i ] = fnc.call( thisv, t[ i ], i, t );
			}
		}
		
		return res;
	};
	
	// Array.prototype.forEach()
	Array.prototype.forEach = Array.prototype.forEach || function _forEach(fnc /*, thisv */) {
    	if( this === undef || this === null )
			throw new TypeError( 'Array.prototype.forEach' );
			
		var t 		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			thisv	= arguments[ 1 ];
			
		if( typeof fnc !== 'function' )
			throw new TypeError( 'Array.prototype.forEach' );
	    
	    for(i = 0; i < len; i++) {
			if( i in t )
				fnc.call( thisv, t[ i ], i, t );
		}
	};

	
	// Array.prototype.every()	
	Array.prototype.every = Array.prototype.every || function _every(fnc /*, thisv */) {
		if( this === undef || this === null )
			throw new TypeError( 'Array.prototype.every' );
			
		var t 		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			thisv	= arguments[ 1 ];
			
		if( typeof fnc !== 'function' )
			throw new TypeError( 'Array.prototype.every' );
			
		for(i = 0; i < len; i++) {
			if( i in t && !fnc.call(thisv, t[i], i, t) )
				return false;
		}
		
		return true;
	};
	
	// Array.prototype.some()
	Array.prototype.some = Array.prototype.some || function _some(fnc /*, thisv */) {
		if( this === undef || this === null )
			throw new TypeError( 'Array.prototype.some' );
			
		var t 		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			thisv	= arguments[ 1 ];
			
		if( typeof fnc !== 'function' )
			throw new TypeError( 'Array.prototype.some' );
			
		for(i = 0; i < len; i++) {
			if( i in t && fnc.call(thisv, t[i], i, t) )
				return true;
		}
		
		return false;
	};
	
	// _ie_garbage_collect helps IE<=8 to garbage collect named function expressions. The function assumes that the expression name is
	// identical to the methodname, with a leading underscore.
	win._ie_garbage_collect = function( targets ) {
		if( Object.type( targets ) !== 'Array' ) {
			targets = [ targets ];
		}
		
		targets.forEach(function( obj ) {
			for( var method in obj ) {
				if( typeof obj[ method ] === 'function' ) {
					var check = '_' + method;
					if( check in obj ) {
						obj[ check ] = null;
					}
				}
			}
		});
	};
	
	// if no JSON object is available, try to load json2.js from a local server (which offers the same functionality)
	if(!( 'JSON' in win ) ) {
		var script 	= doc.createElement( 'script' ),
			head 	= doc.head || doc.getElementsByTagName( 'head' )[ 0 ] || doc.documentElement;
			
		script.async	= 'async';
		script.src		= '/js/components/json2.js';  // needs to get adapted
		script.type 	= 'text/javascript';
		script.onload 	= script.onreadystatechange = function _onload_onreadystatechange() {
			if(!script.readyState || /loaded|complete/.test( script.readyState ) ) {
				script.onload = script.onreadystatechange = null;
				script = undef;
			}
		};
		script.onerror	= function _onerror() {
			throw new Error('toolkit.js: JSON not available.');
		};
		
		head.insertBefore(script, head.firstChild);
	}
	
	
	// create a console object if not availabe and fill it with noop-methods, which the "real" console objects offers
	// this will avoid errors, if there is an access to a console-method on browsers which don't supply a debugger
	if(!( 'console' in win ) ) {
		win.console = { };
		
		'debug info warn exception assert dir dirxml trace group groupEnd time timeEnd profile profileEnd table log error'.split( /\s/ ).forEach(function( prop ) {
			console[ prop ] = function() { };
		});
	}
}(window, window.document));