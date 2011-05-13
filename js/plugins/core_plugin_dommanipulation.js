/* 
 * core_plugin_dommanipulation.js
 * ------------------------------
 * Core plugin: DOM Manipulation (jQuery abstraction level)
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-05-03
 * Changed: 2011-05-12
 */
 
!(function _core_plugin_dommanipulation_wrap( win ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { };

	if( Object.hasKeys( IRcomponents, 'Core' ) ) {
		var Core = IRcomponents.Core;
		
		Core.plugin(function( win, doc, $, Private, Public, Sandbox, PagePreview, undef ) {
			/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.0 ******** *******/
			/****** ************************************************** *******/
			var push	= Array.prototype.push,
				slice	= Array.prototype.slice;
			
			Public.$ = function _$( selector, args ) {
				function Init( sel ) {
					this.constructor = _$;
					push.apply( this, $( sel, args ).get() );
				}
	
				Init.prototype = Private.DOM;
				Init.constructor = _$;
	
				return new Init( selector );
			};
			
			Private.DOM = {
				each: function _each() {
					return $.fn.each.apply( this, arguments );
				},
				map: function _map() {
					return $.fn.map.apply( this, arguments );
				},
				queue: function _queue() {
					return $.fn.queue.apply( this, arguments );
				},
				pushStack: function _pushStack() {
					return $.fn.pushStack.apply( this, arguments );
				},
				domManip: function _domManip() {
					return $.fn.domManip.apply( this, arguments );
				},
				clone: function _clone() {
					var newRef	= this.constructor(),
						args	= arguments;
						
					push.apply( newRef, $.fn.clone.apply( this, args ).get() );

					return newRef;
				},
				get: function _get( index ) {
					return $.fn.get.call( this, index );
				},
				toArray: function _toArray() {
					return $.fn.toArray.call( this );
				},
				ready: function _ready( method ) {
					$.fn.ready.call( this, method );
					return this;
				},
				bind: function _bind( ev, handler ) {
					$.fn.bind.call( this, ev, handler );
					return this;	
				},
				unbind: function _unbind( node, ev, handler ) {
					$.fn.unbind.call( this, ev, handler );
					return this;
				},
				css: function _css( prop, value ) {
					if( value ) {
						$.fn.css.call( this, prop, value );
						return this;	
					}
					else {
						return $.fn.css.call( this, prop );
					}
				},
				animate: function _animate() {
					$.fn.animate.apply( this, arguments );
					return this;
				},
				slice: function _slice() {
					var newRef	= this.constructor(),
						args	= arguments;
						
					push.apply( newRef, ( slice.apply( this, args ) ) );
					
					return newRef;
				},
				delegate: function _delegate( selector, ev, handler ) {
					$.fn.live.call( this, ev, handler, undef, selector );
					return this;
				},
				undelegate: function _undelegate( selector, ev, handler ) {
					if( arguments.length === 0 ) {
						$.fn.unbind.call( this, 'live' );
					}
					else {
						$.fn.die.call( this, ev, null, handler, selector );
					}
					return this;
				},
				remove: function _remove() {
					$.fn.remove.call( this );
					return this;
				},
				append: function _append() {
					$.fn.append.apply( this, arguments );
					return this;
				},
				appendTo: function _appendTo() {
					$.fn.appendTo.apply( this, arguments );
					
					return this;
				},
				after: function _after() {
					$.fn.after.apply( this, arguments );
					
					return this;
				},
				insertAfter: function _insertAfter() {
					$.fn.insertAfter.apply( this, arguments );
					
					return this;
				},
				delay: function _delay( duration, method ) {
					var that	= this,
						args	= slice.apply( arguments, [2] );
						
					if( typeof method === 'string' ) {
						method = that[ method ];
					}
					
					setTimeout(function() {
						method.apply( that, args );
					}, duration);
					
					return that;
				}
			};
			/*
			Private.DOM.snapshot = function _snapshot( root ) {
				if( Object.type( root ) === 'Node' ) {
					var snap 	= [ ],
						$root 	= $( root );
						
					$root.children().each(function _snapshot_each( node ) {
						
					});
				}
				else {
					Public.error({
						type:	'type',
						msg:	'Core: snapshot() expects a DOM node'
					});
				}
			};*/
			/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
			/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		});
	}
	else {
		throw new ReferenceError( 'Plugin: DOM manipulation -> Core not found.' ); 
	}
	
}( window ));
