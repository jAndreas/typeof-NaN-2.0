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
			/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.1 ******** *******/
			/****** ************************************************** *******/
			var push	= Array.prototype.push,
				slice	= Array.prototype.slice,
				each	= Array.prototype.forEach,
				css		= $.fn.css;
			
			Public.$ = function _$( selector, args ) {
				function Init( sel ) {
					this.constructor = _$;
					push.apply( this, $( sel, args ).get() );
				}
	
				Init.prototype = Private.DOM;
				Init.constructor = _$;
	
				return new Init( selector );
			};
			
			Public.ready = function _ready( method ) {
				$.fn.ready.call( this, method );
				return this;
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
				dequeue: function _dequeue() {
					return $.fn.dequeue.apply( this, arguments );
				},
				push: push,
				clone: function _clone() {
					var newRef	= this.constructor(),
						args	= arguments;
						
					push.apply( newRef, $.fn.clone.apply( this, args ).get() );

					return newRef;
				},
				find: function _find() {
					var newRef	= this.constructor(),
						args	= arguments;
					
					push.apply( newRef, $.fn.find.apply( this, arguments ).get() );
					
					this.constructor = null;
					this.prototype = null;
					
					return newRef;
				},
				get: function _get( index ) {
					return $.fn.get.call( this, index );
				},
				toArray: function _toArray() {
					return $.fn.toArray.call( this );
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
					if( value === "" || value ) {
						$.fn.css.call( slice.call( this, 0 ), prop, value );
						return this;	
					}
					else {
						return $.fn.css.call( slice.call( this, 0 ), prop );
					}
				},
				animate: (function _animateAdvancedConditional() {
					var transition	= PagePreview.createCSS('Transition');
					
					if( transition ) {
						return function _animate( props, duration, callback, easing ) {
							var that	= this;

							if( Object.type( props ) === 'Object' && typeof duration === 'number' ) {
								Object.map( props, function( key, value ) {
									return [ PagePreview.createCSS( key ), value ];
								});
								
								each.call( that, function( elem ) {
									css.call( [ elem ], transition, 'all ' + duration/1000 + 's ' + (easing && typeof easing === 'string' ? easing : 'ease' ) );
									css.call( [ elem ], elem.aniprops = props );
									
									setTimeout(function() {
										// TODO: initialize an interval which checks if there still are css prop deltas to be more accurate. 
										css.call( [ elem ], transition, '' );
	
										if( typeof callback === 'function' && !elem.stopAnimation ) {
											callback.apply( elem, [  ] );
										}
										else {
											delete elem.stopAnimation;
										}
									}, duration + 200);
								});
								
								return that;
							}
							else {
								Core.error({
									type:	'type',
									origin:	'Core DOM', 
									name:	'_animate()',
									msg:	'object/number expected, received ' + Object.type( props ) + '/' + Object.type( duration ) + ' instead'
								});
							}
						};
					}
					else {
						return function _animate() {
							var that = this;

							$.fn.animate.apply( that, arguments );
							return that;
						};
					}
				}()),
				stop: (function _stopAdvancedConditional() {
					var transition	= PagePreview.createCSS('Transition');
					
					if( transition ) {
						return function _stop( jumpToEnd ) {
							var that = this;
							
							that.each(function( index, elem ) {
								elem.stopAnimation = true;
								$.fn.css.call( [ elem ], transition, '' );
								
								if( jumpToEnd ) {
									/*setTimeout(function() {
										if( elem.aniprops ) {
											for( var prop in elem.aniprops ) {
												console.log(prop, ': ', elem.aniprops[prop]);
												$.fn.css.call( [ elem ], prop, parseInt(elem.aniprops[prop])+0.1 );
											}
										}
									}, 1);*/
								}
							});
							
							return that;
						}
					}
					else {
						return function _stop() {
							var that = this;
							
							$.fn.stop.apply( that, arguments );
							return that;
						}
					}
				}()),
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
				delay: function _delay( duration, method /* , arguments */ ) {
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
