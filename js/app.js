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
		IRcomponents = IR.components = IR.components || { },
		IRapps = IR.apps = IR.apps || { };

	if( IRcomponents.hasKeys( 'Core Sandbox Module' ) && IRapps.hasKeys( 'PagePreview' ) ) {
		var Core	= IRcomponents.Core,
			Sandbox	= IRcomponents.Sandbox,
			Module	= IRcomponents.Module;

		Core.registerSandbox( Sandbox );
		
		Core.register( 'foobar', Module );
		
		Core.startAll();
	}
	else {
		throw new ReferenceError( 'PagePreview: unable to resolve necessary application object' ); 
	}
	
}( window ));
