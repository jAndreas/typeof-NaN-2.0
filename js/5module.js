/**
 * Javascript Module (Layer 3)
 * -----------------------------------------
 * Basic Module pattern from which other Modules should inherit. A Module should use the Sandbox to complete
 * any application related task. Therefore, the Sandbox needs to abstract all needed methods.
 *
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-23
 */
 
!(function _module_wrap( win, doc, undef ) {
	"use strict";
	win.ir = win.ir || { };
	win.ir.components = win.ir.components || { };
	
	if( 'Sandbox' in win.ir.components ) {
		var Sandbox = win.ir.components.Sandbox;
		
		var Module = (function _Module( secret ) {
			var Public	= { },
				Private	= secret || { 
					Sandbox: Sandbox
				};
				
			Public.init = function _init() {
				Sandbox.error({
					type:	'custom',
					msg:	'Module: missing init() implementation'
				});
			};
			
			Public.destroy = function _destroy() {
				Sandbox.error({
					type:	'custom',
					msg:	'Module: missing destroy() implementation'
				});
			};
				
			return Public;
		}());
		
		win.ir.components.Module = Module;
	}
	else {
		throw new ReferenceError( 'Module: Sandbox object not found' );
	}
}( window, window.document ));
