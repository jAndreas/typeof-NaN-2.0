/* 
 * app.js (PagePreview)
 * ------------------------------
 * Page Preview Application - Wire things up
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-23
 */
 
!(function( win ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = win.ir.components = win.ir.components || { };

	if( IRcomponents.hasKeys( 'Core Sandbox Module' ) ) {
		var Core	= IRcomponents.Core,
			Sandbox	= IRcomponents.Sandbox,
			Module	= IRcomponents.Module;

		Core.registerSandbox( Sandbox );
		
		Core.register( 'foobar', Module );
		
		Core.startAll();
	}
	else {
		throw new ReferenceError( 'Sandbox: Core object not found' ); 
	}
	
}( window ));
