// COMPILE AND RUN IN NASHORN

// Basic polyfilling (exports, global, window, process, console)
// must be run hardcoded from inside the engine, for some reason:
/*
if (typeof exports == 'undefined') { var exports = {}; }
if (typeof global === 'undefined') { var global = this; }
if (typeof window === 'undefined') { var window = this; }
if (typeof process === 'undefined') { var process = {env:{}}; }
if (typeof console === 'undefined') {
    var console = {};
    console.debug = print;
    console.log = print;
    console.warn = print;
    console.error = print;
}
*/

var context = typeof window !== 'undefined' ? window : global;

// Polyfills Set, Map and empty event listener (since nashorn is only used for SSR, where event listener is irrelevant):
var Map = require( 'es6-set-and-map' ).map;
var Set = require( 'es6-set-and-map' ).set;
(function(window) {
    if (typeof window.Map === 'undefined') window.Map = Map;
    if (typeof window.Set === 'undefined') window.Set = Set;
    if (typeof window.addEventListener !== 'function') window.addEventListener = function() {};
    if (typeof window.document === 'undefined') window.document = {};
} )(context);



// polyfills setTimeout() and related
// Based on:
// https://gist.github.com/josmardias/20493bd205e24e31c0a406472330515a
//
// NOTE:
// "At least one timeout needs to be set, larger then your code bootstrap or Nashorn will run forever.
// Preferably, put a timeout 0 after your code bootstrap."
(function(context) {
  'use strict';

  var Timer = Java.type('java.util.Timer');
  var Phaser = Java.type('java.util.concurrent.Phaser');

  var timer = new Timer('jsEventLoop', false);
  var phaser = new Phaser();

  var timeoutStack = 0;
  function pushTimeout() {
    timeoutStack++;
  }
  function popTimeout() {
    timeoutStack--;
    if (timeoutStack > 0) {
      return;
    }
    timer.cancel();
    phaser.forceTermination();
  }

  var onTaskFinished = function() {
    phaser.arriveAndDeregister();
  };

  if (typeof context.setTimeout === 'undefined') {
      context.setTimeout = function(fn, millis /* [, args...] */) {
          var args = [].slice.call(arguments, 2, arguments.length);

          var phase = phaser.register();
          var canceled = false;
          timer.schedule(function() {
              if (canceled) {
                  return;
              }

              try {
                  fn.apply(context, args);
              } catch (e) {
                  print(e);
              } finally {
                  onTaskFinished();
                  popTimeout();
              }
          }, millis);

          pushTimeout();

          return function() {
              onTaskFinished();
              canceled = true;
              popTimeout();
          };
      };
  }

  if (typeof context.clearTimeout === 'undefined') {
      context.clearTimeout = function(cancel) {
          cancel();
      };
  }

  if (typeof context.setInterval === 'undefined') {
      context.setInterval = function(fn, delay /* [, args...] */) {
          var args = [].slice.call(arguments, 2, arguments.length);

          var cancel = null;

          var loop = function() {
              cancel = context.setTimeout(loop, delay);
              fn.apply(context, args);
          };

          cancel = context.setTimeout(loop, delay);
          return function() {
              cancel();
          };
      };
  }

  if (typeof context.clearInterval === 'undefined') {
      context.clearInterval = function(cancel) {
          cancel();
      };
  }

})(context);



// Object.assign
// Polyfill from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#polyfill
if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) {
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}






// KEEP THIS LAST:
// NOTE from https://gist.github.com/josmardias/20493bd205e24e31c0a406472330515a:
// At least one timeout needs to be set, larger then your code bootstrap or Nashorn will run forever.
// Preferably, put a timeout 0 after your code bootstrap.
context.setTimeout(function(){}, 1);
