/**
 * Javascript Module (Layer 3)
 * -----------------------------------------
 * Basic Module pattern from which other Modules should inherit. A Module should use the Sandbox to complete
 * any application related task. Therefore, the Sandbox needs to abstract all necessary methods.
 *
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-23
 */

!(function _module_wrap( win, doc, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { },

	Module = function _Module( Sandbox ) {
		var Public	= { },
			Private	= { 
				AppRef: IR.apps.PagePreview
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
	};
	
	IRcomponents.Module = Module;
}( window, window.document ));
