/* 
 * app.js (PagePreview)
 * ------------------------------
 * Page Preview Application - Wire things up
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-23
 * Changed: 2011-05-06
 */
 
!(function _application_wrap( win ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { },
		IRapps = IR.apps = IR.apps || { };

	if( Object.hasKeys( IRcomponents, 'Core Sandbox' ) && Object.hasKeys( IRapps, 'PagePreview' ) ) {
		var Core		= IRcomponents.Core,
			Sandbox		= IRcomponents.Sandbox,
			Modules		= IRcomponents.Modules;
	
		Core.registerSandbox( Sandbox );
		
		Core.registerModule( 'Filter', Modules.Filter );
		
		Core.startAll();
		
		setTimeout(Core.stopAll, 6000);
	}
	else {
		throw new ReferenceError( 'PagePreview: unable to resolve necessary application object' ); 
	}
	
}( window ));
