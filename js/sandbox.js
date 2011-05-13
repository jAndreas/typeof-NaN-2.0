/**
 * Javascript Sandbox (Layer 2)
 * -----------------------------------------
 * The Sandbox is the Module's view into the outside world and serves to keep the Module loosely-coupled.
 * It's responsible for the communication with other Modules, Ajax requests, retrieving a Module's base
 * DOM node, event handlers etc.
 * 
 * Every task a Module wants to accomplish must be marshaled through the Sandbox. Infact, the Sandbox object
 * does not implement any functionality at all. It's just the modules view and interface to the Core.
 *
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-17
 * Changed: 2011-05-09
 */

!(function _sandbox_wrap( win, doc, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { },
	
	Sandbox = function _Sandbox( Core ) {
		var Public		= { },
			Private		= { };
			
		function assign( method ) {
			if( method in Core && typeof Core[ method ] === 'function' ) {
				Public[ method ] = Core[ method ];
			}
			else {
				// should we fail silently here instead ?
				throw new ReferenceError( 'Sandbox: Method "' + method + '" not available in Core' );
			}
		}

		if( Object.type( Core ) === 'Object' ) {
			'error listen dispatch forget request Promise when $ extend'.split( /\s/ ).forEach(function( methodName ) {
				assign( methodName );
			});
			
			return Public;
		}
		else {
			throw new ReferenceError( 'Sandbox: No Core specified' );
		}
	};

	IRcomponents.Sandbox = Sandbox;
}( window, window.document ));