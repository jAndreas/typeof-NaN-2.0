/**
 * Javascript Module Template (Layer 3)
 * -----------------------------------------
 * Basic Module pattern from which other Modules should inherit. A Module should use the Sandbox to complete
 * any application related task. Therefore, the Sandbox needs to abstract all necessary methods.
 *
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-23
 * Changed: 2011-05-30
 */

!(function _module_wrap( win, doc, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { },

	ModuleCtor = function _ModuleCtor( Sandbox, AppRef ) {
		var Public	= { },
			Private	= { };

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Sandbox.error({
				type:	'custom',
				origin:	'Module Constructor',
				name:	'_init()',
				msg:	'missing init() implementation'
			});
		};
		
		Public.destroy = function _destroy() {
			Sandbox.error({
				type:	'custom',
				origin:	'Module Constructor',
				name:	'_destroy()',
				msg:	'missing destroy() implementation'
			});
		};
		
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		Public.multipleInstances = false;
			
		return Public;
	};
	
	IRcomponents.ModuleCtor = ModuleCtor;
}( window, window.document ));
