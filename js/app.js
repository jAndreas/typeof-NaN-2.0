/* 
 * app.js ( Example )
 * ------------------------------
 * typeofNaN 2.0 - Wire things up
 *
 * * This code runs in strict mode (if supported by the environment)
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-11-10
 * Changed: 2011-11-11
 */
 
!(function _application_wrap( win ) {
	"use strict";
	var	BF = win.BarFoos = win.BarFoos || { },
		BFapps = BF.apps = BF.apps || { };

	if( Object.hasKeys( BF, 'Core Sandbox' ) && Object.hasKeys( BFapps, 'TypeofNaN' ) ) {
		var	Core		= BF.Core,
			Sandbox		= BF.Sandbox,
			Modules		= BF.Modules,
			App			= BFapps.TypeofNaN;
	
		// register Sandbox
		Core.registerSandbox( Sandbox );
		
		// register Modules
		Core.registerModule( 'Window', Modules.Window );
				
		if( Core.createCSS( 'perspective' ) ) {
			Core.registerModule( 'Box3D' );
		}
		else {
			Core.registerModule( 'Box2D' );
		}
		
		// startup all registered Modules
		Core.startAll();


		// register Modules which are not loaded immediately / deferred
		//Core.registerModule( 'Journal', Modules.Journal );
		
		// All pure application specific stuff on events 
		//Core.listen( [ 'SomeSpecialEvent' ], function _applicationEvents( event ) {
		//	var eventData = event.data;
		//	
		//	Core.start( 'ExampleModule', eventData );
		//}, null);		
	}
	else {
		throw new ReferenceError( 'typeofNaN2.0: unable to resolve necessary application object' ); 
	}
	
}( window ));
