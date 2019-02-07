"use strict"
define("wavetable-editor/app",["exports","wavetable-editor/resolver","ember-load-initializers","wavetable-editor/config/environment"],function(e,t,n,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=Ember.Application.extend({modulePrefix:i.default.modulePrefix,podModulePrefix:i.default.podModulePrefix,Resolver:t.default});(0,n.default)(r,i.default.modulePrefix)
var o=r
e.default=o}),define("wavetable-editor/components/canvas-display",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({tagName:"canvas",attributeBindings:["width","height"],width:500,height:500,update:function(){},renderCanvas:function(){},clear:function(){this.context.resetTransform(),this.context.clearRect(0,0,this.width,this.height)},isOnScreen:function(){return e=this.element,(t=e.getBoundingClientRect()).bottom>=0&&t.top<=(window.innerHeight||document.documentElement.clientHeight)&&t.right>=0&&t.left<=(window.innerWidth||document.documentElement.clientWidth)
var e,t},getScrollPosition:function(){return e=this.element,((t=e.getBoundingClientRect()).top+t.bottom)/2/(window.innerHeight||document.documentElement.clientHeight)
var e,t},didInsertElement:function(){this._super.apply(this,arguments),this.set("context",this.element.getContext("2d"))}})
e.default=t}),define("wavetable-editor/components/wave-draw",["exports","wavetable-editor/lib/conductor","wavetable-editor/lib/controllers/wave-draw-controller","wavetable-editor/lib/controllers/wave-split-controller","wavetable-editor/lib/controllers/range-controller","wavetable-editor/utils/download-file"],function(e,t,n,i,r,o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=5,s=Ember.Component.extend({peak:Ember.inject.service("devices.peak"),synth:Ember.inject.service(),classNames:["wavetable-editor"],hasFourierData:Ember.computed.bool("fourierData"),noData:Ember.computed.not("hasFourierData"),disableDownloadButton:Ember.computed.readOnly("noData"),disableSendButton:Ember.computed.or("noData","peak.notConnected"),playSound:function(){var e=this.waveDrawSplitController.partialWave
this.synth.playSoundWave(e)},generateSyx:function(){var e=this.fourierData,t=e.sort(function(e,t){return e.freq-t.freq}).map(function(e){return Math.floor(16384*e.amplitude)}),n=[]
t.forEach(function(e){var t=127&e,i=e>>7
n.push(t,i)})
var i=this.buildMessage(n,[1,16])
return i},sendSysex:function(e){if(this.peak.notConnected)console.log("sysex",e)
else{var t=this.peak.output
t&&t.send(e)}},downloadSysex:function(e){var t=new Blob([e])
return(0,o.default)(t,"wavetable.syx")},buildMessage:function(e){var t=this.peak.productId
if(t&&!(t.length<2)){return new Uint8Array([240,0,32,41,1,16,t[0],t[1],a,0,0].concat(e,[247]))}},didInsertElement:function(){var e=this
this._super.apply(this,arguments)
var o=[],a=new n.default("wave-draw"),s=document.getElementById("wave-draw-instruction")
a.onDrawingStart.push(function(){return s.classList.add("hidden")}),o.push(a)
var u=new r.default("wave-draw-slider")
u.animate=!1,o.push(u)
var l=new i.default("wave-draw-split")
a.onDrawingStart.push(function(){l.splitAnim=!0,l.setPath([])}),o.push(l),this.set("waveDrawSplitController",l),a.onDrawingEnd.push(function(){l.splitAnim=!0,l.setPath(a.normPath)}),a.onDrawingStart.push(function(){return u.slider.value=1}),a.onDrawingEnd.push(function(){return u.slider.value=1}),a.onDrawingEnd.push(function(){return e.set("fourierData",e.waveDrawSplitController._fourierData)}),u.onValueChange.push(function(e){l.fourierAmt=e,l.splitAnim=!1})
document.getElementById("wave-draw-button")
var d=new t.default(o)
d.start(),this.set("conductor",d)},actions:{playSound:function(){this.playSound()},sendSysex:function(){var e=this.generateSyx()
this.sendSysex(e)},downloadSysex:function(){var e=this.generateSyx()
this.downloadSysex(e)}}})
e.default=s}),define("wavetable-editor/components/waveform-display",["exports","wavetable-editor/components/canvas-display"],function(e,t){function n(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t]
return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=t.default.extend({init:function(){this._super.apply(this,arguments),this.setProperties({animAmt:0,wavePoints:[],partialWave:[],fourierPoints:[],onFourierChange:[],waveTop:0,waveBottom:0,totalHeight:0,fadeFrequencies:!0,splitAnim:!0,fourierAmt:1})},setPath:function(e){var t=this,i=e.reduce(function(e,t){return e+t},0)/e.length
this.set("wavePoints",e.map(function(e){return e-i})),this.set("fourierData",getRealFourierData(this.wavePoints).filter(function(e){return e.amplitude>.001})),this.fourierData.sort(function(e,t){return t.amplitude-e.amplitude}),this.set("waveTop",Math.min.apply(Math,n(this.wavePoints))),this.set("waveBottom",Math.max.apply(Math,n(this.wavePoints))),this.set("totalHeight",this.waveBottom-this.waveTop),this.fourierData.forEach(function(e){return t.totalHeight+=2*e.amplitude}),this.set("animAmt",0),this.set("splitAmt",0),this.onFourierChange.forEach(function(e){return e()})}})
e.default=i}),define("wavetable-editor/components/waveform-editor",["exports","wavetable-editor/components/canvas-display"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n="#e91e63"
function i(e,t,n){return(t-e)*n+e}var r=t.default.extend({width:500,height:500,drawing:!1,normPath:Ember.computed("wavePoints","height",function(){var e=this
return this.wavePoints.map(function(t){return t/e.height})}),init:function(){this._super.apply(this,arguments),this.setProperties({wavePoints:new Array(128).fill(this.height/2),drawing:!1,onDrawingStart:[],onDrawingEnd:[],lastMousePoint:null})},startDrawing:function(){this.setProperties({drawing:!0,lastMousePoint:!0}),this.onDrawingStart.forEach(function(e){return e()})},stopDrawing:function(){this.drawing&&(this.setProperties({drawing:!1,lastMousePoint:null}),this.onDrawingEnd.forEach(function(e){return e()}))},update:function(e,t){if(t&&this.drawing){var n=this.element.getBoundingClientRect(),r=500/(n.right-n.left-2),o={x:r*(t.x-n.x),y:r*(t.y-n.y)}
null==this.lastMousePoint&&this.set("lastMousePoint",o)
for(var a=Math.abs(o.x-this.lastMousePoint.x),s=this.width/this.wavePoints.length,u=2*Math.ceil(a/s)+1,l=0;l<u;l++){var d=(l-1)/u,c=this.getNearestIndex(i(this.lastMousePoint.x,o.x,d))
this.wavePoints[c]=i(this.lastMousePoint.y,o.y,d)}this.set("lastMousePoint",o)}},getNearestIndex:function(e){var t=e/this.width,n=Math.round(this.wavePoints.length*t)%this.wavePoints.length
return n<0&&(n+=this.wavePoints.length),n},renderCanvas:function(){this.clear(),this.renderWave()},renderWave:function(){this.context.beginPath(),this.context.lineWidth=2,this.context.strokeStyle=n
for(var e=0;e<=this.wavePoints.length;e++){var t=e%this.wavePoints.length,i=e/this.wavePoints.length,r=this.width*i,o=this.wavePoints[t]
0==e?this.context.moveTo(r,o):this.context.lineTo(r,o)}this.context.stroke()},mouseDown:function(){this.startDrawing()},mouseUp:function(){this.stopDrawing()},touchStart:function(){this.startDrawing()},touchEnd:function(){this.stopDrawing()},touchMove:function(e){e.preventDefault()},didInsertElement:function(){this._super.apply(this,arguments),this.renderCanvas()}})
e.default=r}),define("wavetable-editor/helpers/app-version",["exports","wavetable-editor/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n){function i(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.default.APP.version,o=i.versionOnly||i.hideSha,a=i.shaOnly||i.hideVersion,s=null
return o&&(i.showExtended&&(s=r.match(n.versionExtendedRegExp)),s||(s=r.match(n.versionRegExp))),a&&(s=r.match(n.shaRegExp)),s?s[0]:r}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=i,e.default=void 0
var r=Ember.Helper.helper(i)
e.default=r}),define("wavetable-editor/helpers/cancel-all",["exports","ember-concurrency/helpers/cancel-all"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("wavetable-editor/helpers/perform",["exports","ember-concurrency/helpers/perform"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("wavetable-editor/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("wavetable-editor/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("wavetable-editor/helpers/task",["exports","ember-concurrency/helpers/task"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("wavetable-editor/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","wavetable-editor/config/environment"],function(e,t,n){var i,r
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n.default.APP&&(i=n.default.APP.name,r=n.default.APP.version)
var o={name:"App Version",initialize:(0,t.default)(i,r)}
e.default=o}),define("wavetable-editor/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}
e.default=n}),define("wavetable-editor/initializers/ember-concurrency",["exports","ember-concurrency/initializers/ember-concurrency"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("wavetable-editor/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i={name:"ember-data",initialize:t.default}
e.default=i}),define("wavetable-editor/initializers/export-application-global",["exports","wavetable-editor/config/environment"],function(e,t){function n(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var n
if("undefined"!=typeof window)n=window
else if("undefined"!=typeof global)n=global
else{if("undefined"==typeof self)return
n=self}var i,r=t.default.exportApplicationGlobal
i="string"==typeof r?r:Ember.String.classify(t.default.modulePrefix),n[i]||(n[i]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete n[i]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=n,e.default=void 0
var i={name:"export-application-global",initialize:n}
e.default=i}),define("wavetable-editor/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"ember-data",initialize:t.default}
e.default=n}),define("wavetable-editor/instance-initializers/midi-device",["exports"],function(e){function t(e){e.inject("controller:application","midiDevice","service:midi-device")}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=t,e.default=void 0
var n={initialize:t}
e.default=n}),define("wavetable-editor/lib/color",["exports","wavetable-editor/lib/util"],function(e,t){function n(e,t,n){return"rgb("+e+","+t+","+n+")"}Object.defineProperty(e,"__esModule",{value:!0}),e.rgb=n,e.grey=function(e){e=(0,t.clamp)(e,0,1)
var i=Math.floor(255*e)
return n(i,i,i)},e.palette=void 0
e.palette={black:"#333",blue:"#4657d7",cyan:"#57a7cc",pink:"#e91e63",orange:"#ed7656"}}),define("wavetable-editor/lib/conductor",["exports"],function(e){function t(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(t){var n=this;(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this.lastTime=Date.now(),this.mousePosition=null,this.controllers=t.slice(),this.updatingControllers=[],document.addEventListener("mousemove",function(e){return n.updateMousePosition(e)}),document.addEventListener("mousedown",function(e){return n.updateMousePosition(e)}),document.addEventListener("mouseup",function(e){return n.updateMousePosition(e)}),document.addEventListener("touchmove",function(e){return n.updateTouchPosition(e)}),document.addEventListener("touchstart",function(e){return n.updateTouchPosition(e)}),document.addEventListener("touchend",function(e){return n.updateTouchPosition(e)}),window.addEventListener("resize",function(e){return n.onResize(e)})}var n,i,r
return n=e,(i=[{key:"start",value:function(){var e=this
window.requestAnimationFrame(function(){return e.everyFrame()})}},{key:"onResize",value:function(e){this.controllers.forEach(function(e){"function"==typeof e.onResize&&e.onResize()})}},{key:"everyFrame",value:function(){var e=this
this.update(),this.render(),requestAnimationFrame(function(){return e.everyFrame()})}},{key:"update",value:function(){var e=this,t=Date.now(),n=(t-this.lastTime)/1e3
this.updatingControllers=[],this.controllers.forEach(function(t){t.isOnScreen()&&(t.update(n,e.mousePosition),e.updatingControllers.push(t))}),this.lastTime=t
var i=document.getElementById("debug-content")
i&&(i.innerHTML=this.updatingControllers.map(function(e){return e.id}).join("<br>")+"<br>")}},{key:"render",value:function(){this.controllers.forEach(function(e){e.isOnScreen()&&e.render()})}},{key:"updateMousePosition",value:function(e){this.mousePosition={x:e.clientX,y:e.clientY}}},{key:"updateTouchPosition",value:function(e){e.touches.length>0&&(this.mousePosition={x:e.touches[0].clientX,y:e.touches[0].clientY})}}])&&t(n.prototype,i),r&&t(n,r),e}()
e.default=n}),define("wavetable-editor/lib/controllers/canvas-controller",["exports","wavetable-editor/lib/controllers/controller-util","wavetable-editor/lib/controllers/controller"],function(e,t,n){function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function o(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}(e):t}function a(e){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var u=function(e){function i(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null
return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=o(this,a(i).call(this))).id=e,t.canvas=document.getElementById(e),null==n&&(n=t.canvas.width),null==r&&(r=t.canvas.height),t.context=t.canvas.getContext("2d"),t.width=n,t.height=r,t}var u,l,d
return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(i,n.default),u=i,(l=[{key:"isOnScreen",value:function(){return(0,t.elementInView)(this.canvas)}},{key:"getScrollPosition",value:function(){return(0,t.getScrollPosition)(this.canvas)}},{key:"clear",value:function(){this.context.resetTransform(),this.context.clearRect(0,0,this.canvas.width,this.canvas.height)}}])&&r(u.prototype,l),d&&r(u,d),i}()
e.default=u}),define("wavetable-editor/lib/controllers/controller-util",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.getScrollPosition=function(e){var t=e.getBoundingClientRect(),n=(t.top+t.bottom)/2,i=window.innerHeight||document.documentElement.clientHeight
return n/i},e.elementInView=function(e){var t=e.getBoundingClientRect()
return t.bottom>=0&&t.top<=(window.innerHeight||document.documentElement.clientHeight)&&t.right>=0&&t.left<=(window.innerWidth||document.documentElement.clientWidth)}}),define("wavetable-editor/lib/controllers/controller",["exports"],function(e){function t(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e)}var n,i,r
return n=e,(i=[{key:"update",value:function(e,t){}},{key:"isOnScreen",value:function(){return!0}},{key:"render",value:function(){}}])&&t(n.prototype,i),r&&t(n,r),e}()
e.default=n}),define("wavetable-editor/lib/controllers/range-controller",["exports","wavetable-editor/lib/util","wavetable-editor/lib/controllers/controller"],function(e,t,n){function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function o(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}(e):t}function a(e){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var u=function(e){function i(e){var t
return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=o(this,a(i).call(this))).id=e,t.slider=document.getElementById(e),t.onValueChange=[],t.holdValueCount=0,t.holdValueLength=10,t.heldValue=0,t.resumeCount=0,t.resumeLength=2,t.animate=!0,t.animAmt=0,t.period=10,t.slider.oninput=function(){return t.holdValue()},t}var u,l,d
return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(i,n.default),u=i,(l=[{key:"update",value:function(e,n){var i=this
if(this.animate){if(this.holdValueCount>0)return this.holdValueCount-=e,void(this.holdValueCount<=0&&(this.holdValueCount=0))
this.resumeCount>0&&(this.resumeCount-=e,this.resumeCount<=0&&(this.resumeCount=0))
var r=1-this.resumeCount/this.resumeLength,o=(0,t.easeInOut)(r,3)
this.animAmt+=o*e/this.period,this.animAmt%=1
var a=.5*Math.cos(2*Math.PI*this.animAmt)+.5
this.slider.value=a,this.onValueChange.forEach(function(e){return e(i.slider.value)})}}},{key:"holdValue",value:function(){var e=this
this.holdValueCount=this.holdValueLength,this.resumeCount=this.resumeLength,this.heldValue=this.slider.value,this.animAmt=Math.acos(2*this.heldValue-1)/(2*Math.PI),this.onValueChange.forEach(function(t){return t(e.slider.value)})}}])&&r(u.prototype,l),d&&r(u,d),i}()
e.default=u}),define("wavetable-editor/lib/controllers/wave-draw-controller",["exports","wavetable-editor/lib/controllers/canvas-controller","wavetable-editor/lib/util","wavetable-editor/lib/color"],function(e,t,n,i){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function a(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}(e):t}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var l=function(e){function r(e,t,n){var i
return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r),(i=a(this,s(r).call(this,e,t,n))).wavePoints=new Array(128).fill(i.height/2),i.drawing=!1,i.onDrawingStart=[],i.onDrawingEnd=[],i.lastMousePoint=null,i.canvas.addEventListener("mousedown",function(){return i.startDrawing()}),i.canvas.addEventListener("touchstart",function(){return i.startDrawing()}),document.addEventListener("mouseup",function(){return i.stopDrawing()}),document.addEventListener("touchend",function(){return i.stopDrawing()}),i.canvas.addEventListener("touchmove",function(e){return e.preventDefault()},{passive:!1}),i}var l,d,c
return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(r,t.default),l=r,(d=[{key:"startDrawing",value:function(){this.drawing=!0,this.lastMousePoint=null,this.onDrawingStart.forEach(function(e){return e()})}},{key:"stopDrawing",value:function(){this.drawing&&(this.drawing=!1,this.lastMousePoint=null,this.onDrawingEnd.forEach(function(e){return e()}))}},{key:"update",value:function(e,t){if(t&&this.drawing){var i=this.canvas.getBoundingClientRect(),r=500/(i.right-i.left-2),o={x:r*(t.x-i.x),y:r*(t.y-i.y)}
null==this.lastMousePoint&&(this.lastMousePoint=o)
for(var a=Math.abs(o.x-this.lastMousePoint.x),s=this.width/this.wavePoints.length,u=2*Math.ceil(a/s)+1,l=0;l<u;l++){var d=(l-1)/u,c=this.getNearestIndex((0,n.slurp)(this.lastMousePoint.x,o.x,d))
this.wavePoints[c]=(0,n.slurp)(this.lastMousePoint.y,o.y,d)}this.lastMousePoint=o}}},{key:"getNearestIndex",value:function(e){var t=e/this.width,n=Math.round(this.wavePoints.length*t)%this.wavePoints.length
return n<0&&(n+=this.wavePoints.length),n}},{key:"render",value:function(){this.clear(),this.renderWave()}},{key:"renderWave",value:function(){this.context.beginPath(),this.context.lineWidth=2,this.context.strokeStyle=i.palette.pink
for(var e=0;e<=this.wavePoints.length;e++){var t=e%this.wavePoints.length,n=e/this.wavePoints.length,r=this.width*n,o=this.wavePoints[t]
0==e?this.context.moveTo(r,o):this.context.lineTo(r,o)}this.context.stroke()}},{key:"normPath",get:function(){var e=this
return this.wavePoints.map(function(t){return t/e.height})}}])&&o(l.prototype,d),c&&o(l,c),r}()
e.default=l}),define("wavetable-editor/lib/controllers/wave-split-controller",["exports","wavetable-editor/lib/controllers/canvas-controller","wavetable-editor/lib/util","wavetable-editor/lib/just-fourier-things","wavetable-editor/lib/color","wavetable-editor/lib/wave-things"],function(e,t,n,i,r,o){function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t]
return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function u(e,t){for(var n=0;n<t.length;n++){var i=t[n]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function l(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}(e):t}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var f=function(e){function a(e,t,n){var i
return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(i=l(this,d(a).call(this,e,t,n))).animAmt=0,i.wavePoints=[],i.partialWave=[],i.fourierPoints=[],i.onFourierChange=[],i.waveTop=0,i.waveBottom=0,i.totalHeight=0,i.fadeFrequencies=!0,i.splitAnim=!0,i.fourierAmt=1,i}var f,h,p
return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(a,t.default),f=a,(h=[{key:"setPath",value:function(e){var t=this,n=e.reduce(function(e,t){return e+t},0)/e.length
this.wavePoints=e.map(function(e){return e-n}),this.fourierData=(0,i.getRealFourierData)(this.wavePoints).filter(function(e){return e.amplitude>.001}),this._fourierData=(0,i.getRealFourierData)(this.wavePoints),this.fourierData.sort(function(e,t){return t.amplitude-e.amplitude}),this.waveTop=Math.min.apply(Math,s(this.wavePoints)),this.waveBottom=Math.max.apply(Math,s(this.wavePoints)),this.totalHeight=this.waveBottom-this.waveTop,this.fourierData.forEach(function(e){return t.totalHeight+=2*e.amplitude}),this.animAmt=0,this.splitAmt=0,this.onFourierChange.forEach(function(e){return e()})}},{key:"update",value:function(e,t){this.animAmt+=e/7,this.animAmt%=1
var n=0
this.getScrollPosition()<.7&&(n=1),this.splitAmt+=1/15*(n-this.splitAmt)}},{key:"render",value:function(){this.clear(),this.renderWaves()}},{key:"renderWaves",value:function(){if(0!=this.wavePoints.length){this.context.strokeStyle=r.palette.cyan,this.context.lineWidth=2
var e=Math.min(50,this.fourierData.length),t=.1*this.context.canvas.height,i=(.9*this.context.canvas.height-t)/this.totalHeight,a=0,s=-this.animAmt,u=1,l=1
this.splitAnim&&(l=u=this.splitAmt),a+=this.waveBottom-this.waveTop,this.partialWave=this.wavePoints.slice().fill(0)
for(var d=Math.round((0,n.slurp)(1,e,this.fourierAmt)),c=0;c<d;c++){var f=c/(e-1),h=this.fourierData[c]
a+=h.amplitude
for(var p=(0,n.slurp)(-this.waveTop,a,u),v=this.wavePoints.slice(),m=0;m<this.wavePoints.length;m++){var b=m/this.wavePoints.length,w=this.wavePoints[m],g=h.amplitude*Math.cos(2*Math.PI*h.freq*b+h.phase)
v[m]=(0,n.slurp)(w,g,u),this.partialWave[m]+=v[m]}this.context.beginPath(),this.context.globalAlpha=l,this.fadeFrequencies&&(this.context.globalAlpha*=1-f),(0,o.renderWave)({context:this.context,width:this.width,wave:v,yPosition:t+i*p,yMultiple:.8*i,startXAmt:s}),this.context.stroke(),this.context.globalAlpha=1,a+=h.amplitude}a=0,a-=this.waveTop,1==this.fourierAmt&&(this.partialWave=this.wavePoints),this.context.strokeStyle=r.palette.blue,this.context.lineWidth=2,this.context.beginPath(),(0,o.renderWave)({context:this.context,width:this.width,wave:this.partialWave,yPosition:t+i*a,yMultiple:.8*i,startXAmt:s}),this.context.stroke()}}}])&&u(f.prototype,h),p&&u(f,p),a}()
e.default=f}),define("wavetable-editor/lib/just-fourier-things",["exports","fft","wavetable-editor/lib/util"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.getFourierData=function(e){if(0==e.length)return[]
var n=e.length/2,i=new t.default(n),r=i.createComplexArray()
i.transform(r,e)
for(var o=[],a=0;a<n;a++){var s=a%2==0?a/2:n-(a+1)/2,u=r[2*s],l=r[2*s+1],d=(s+n/2)%n-n/2
o.push({freq:d,amplitude:Math.sqrt(u*u+l*l)/n,phase:Math.atan2(l,u)})}return o},e.getRealFourierData=function(e){if(0==e.length)return[]
var n=e.length,i=new t.default(n),r=i.createComplexArray()
i.toComplexArray(e,r)
var o=i.createComplexArray()
i.transform(o,r)
for(var a=[],s=0;s<n/2;s++){var u=o[2*s],l=o[2*s+1],d=s
a.push({freq:d,amplitude:2*Math.sqrt(u*u+l*l)/n,phase:Math.atan2(l,u)})}return a},e.resample2dData=function(e,t){if(0==e.length)return[]
for(var i=[],r=0;r<t;r++){var o=e.length*(r/t),a=Math.floor(o),s=(a+1)%e.length,u=o-a
i.push((0,n.slurp)(e[a].x,e[s].x,u),(0,n.slurp)(e[a].y,e[s].y,u))}return i}}),define("wavetable-editor/lib/util",["exports"],function(e){function t(e,t,n){return(t-e)*n+e}Object.defineProperty(e,"__esModule",{value:!0}),e.easeInOut=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,n=Math.pow(e,t)
return n/(n+Math.pow(1-e,t))},e.sinEaseInOut=function(e){return.5-.5*Math.cos(Math.PI*e)},e.smallEaseInOut=function e(t,n,i){var r=1/(1-n-i)
if(t<n)return 0
if(t<i)return r/2/(i-n)*(t-n)*(t-n)
if(t<1-i)return r*(t-i)+r/2*(i-n)
return 1-e(1-t,n,i)},e.slurp=t,e.experp=function(e,n,i){return Math.exp(t(Math.log(e),Math.log(n),i))},e.clampedSlurp=function(e,n,i){if(i<0)return e
if(i>1)return n
return t(e,n,i)},e.clamp=function(e,t,n){if(e<t)return t
if(e>n)return n
return e},e.divideInterval=function(e,t,n){return(e-t)/(n-t)},e.posMod=function(e,t){var n=e%t
n<0&&(n+=t)
return n}}),define("wavetable-editor/lib/wave-things",["exports","wavetable-editor/lib/util"],function(e,t){function n(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t]
return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}Object.defineProperty(e,"__esModule",{value:!0}),e.getWave=function(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:128,n=[],i=0;i<t;i++){var r=i/t
n.push(e(r))}return n},e.normaliseWave=function(e){var i=Math.min.apply(Math,n(e)),r=Math.max.apply(Math,n(e))
return e.map(function(e){return(0,t.slurp)(-1,1,(e-i)/(r-i))})},e.getWaveFunction=function(e){return function(n){(n%=1)<0&&n++
var i=Math.floor(e.length*n),r=(i+1)%e.length,o=e.length*n%1
return(0,t.slurp)(e[i],e[r],o)}},e.squareWave=function(e){return e<.5?-1:1},e.renderWave=function(e){for(var t=e.context,n=e.wave,i=e.width,r=e.yPosition,o=void 0===r?0:r,a=e.yMultiple,s=e.startXAmt,u=void 0===s?0:s,l=e.type,d=void 0===l?"wave":l,c=1/n.length,f=u,h=0;f<=1+c;f+=c,h++){var p=h%n.length,v=i*f,m=o+a*n[p]
"wave"==d?0==h?t.moveTo(v,m):t.lineTo(v,m):"samples"==d&&(t.beginPath(),t.arc(v,m,2,0,2*Math.PI),t.fill())}}}),define("wavetable-editor/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n})
define("wavetable-editor/router",["exports","wavetable-editor/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
n.map(function(){})
var i=n
e.default=i}),define("wavetable-editor/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("wavetable-editor/services/devices/circuit",["exports","wavetable-editor/services/devices/device"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default.extend({productName:"Circuit",productId:[0,121],midiEventKeys:{bootloader:"circuit:bootloader:midimessage",main:"circuit:main:midimessage"},observeStatus:Ember.observer("status",function(){var e=this.get("status")
"present"===e?this.trigger("circuit:main:connected"):"bootloader"===e?this.trigger("circuit:bootloader:connected"):this.trigger("circuit:disconnected")}),handleVersionMessage:function(){return this._super.apply(this,arguments)},isBootloader:function(e){return-1!==e.indexOf("Circuit Bootloader")},isConnected:function(e){return-1===e.indexOf("Circuit Bootloader")&&-1!==e.indexOf("Circuit")&&-1===e.indexOf("Circuit Mono Station")}})
e.default=n}),define("wavetable-editor/services/devices/device",["exports","ember-concurrency","wavetable-editor/utils/check-manufacturer-id"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=Ember.Service.extend(Ember.Evented,{midiDevice:Ember.inject.service(),midiEventKeys:{bootloader:"bootloader:midimessage",main:"main:midimessage"},input:null,output:null,mainInput:null,mainOutput:null,bootloaderVersion:void 0,firmwareVersion:void 0,latestFirmwareVersion:void 0,productName:void 0,productId:void 0,rebootTimeout:1e4,ready:Ember.computed.equal("status","bootloader"),notReady:Ember.computed.not("ready"),notConnected:Ember.computed.not("connected"),status:Ember.computed("input","output","mainInput","mainOutput",function(){return this.get("input")&&this.get("output")?"bootloader":this.get("mainInput")&&this.get("mainOutput")?"present":"offline"}),connected:Ember.computed("status",function(){return"offline"!==this.get("status")}),needsFirmwareUpdate:Ember.computed("firmwareVersion","connected",function(){return this.connected&&this.get("firmwareVersion")<this.get("latestFirmwareVersion")}),updateVersionTask:(0,t.task)(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,t.timeout)(100)
case 2:this.updateVersion()
case 3:case"end":return e.stop()}},e,this)})),init:function(){this._super.apply(this,arguments),this.midiMainMessage=this.midiMainMessage.bind(this),this.midiBootloaderMessage=this.midiBootloaderMessage.bind(this)},isBootloader:function(e){return-1!==e.indexOf("".concat(this.get("productName")," Bootloader"))},isConnected:function(e){var t=this.get("productName")
return-1===e.indexOf("".concat(t," Bootloader"))&&-1!==e.indexOf(t)},updateMidiPort:function(e){"input"===e.type?this.updateMidiInput(e):this.updateMidiOutput(e)},_updateMidiInput:function(e,t){this.set(e,"connected"===t.state?t:null),"connected"===t.state&&this.subscribeToMidiMessages()},_updateMidiOutput:function(e,t){this.set(e,"connected"===t.state?t:null),"connected"===t.state&&this.get("updateVersionTask").perform()},updateMidiInput:function(e){this.isBootloader(e.name)?(this._updateMidiInput("input",e),this.set("mainInput",null)):this.isConnected(e.name)&&(this._updateMidiInput("mainInput",e),this.set("input",null))},updateMidiOutput:function(e){this.isBootloader(e.name)?(this._updateMidiOutput("output",e),this.set("mainOutput",null)):this.isConnected(e.name)&&(this._updateMidiOutput("mainOutput",e),this.set("output",null))},versionFromBytes:function(e){var t=0
return e.reverse().forEach(function(e,n){t+=Math.pow(10,n)*e}),t},handleVersionMessage:function(e){var t=e.data
return!(240!==t[0]||!this.checkManufacturerId(t))&&(112===t[5]?(this.set("bootloaderVersion",this.versionFromBytes(t.slice(6,11))),this.set("firmwareVersion",this.versionFromBytes(t.slice(11,16))),!0):void 0)},updateVersion:function(){var e=this.get("status")
if("present"===e)this.get("mainOutput").send([240,0,32,41,0,112,247])
else{if("bootloader"!==e)return this.set("bootloaderVersion",void 0),void this.set("firmwareVersion",void 0)
this.get("output").send([240,0,32,41,0,112,247])}},updateVersionViaDeviceInquiry:function(){if("present"!==this.get("status"))return this.set("bootloaderVersion",void 0),void this.set("firmwareVersion",void 0)
this.get("mainOutput").send([240,126,127,6,1,247])},checkManufacturerId:n.default,subscribeToMidiMessages:function(){var e=this.get("mainInput"),t=this.get("input")
e?(e.removeEventListener("midimessage",this.midiMainMessage),e.addEventListener("midimessage",this.midiMainMessage)):t&&(t.removeEventListener("midimessage",this.midiBootloaderMessage),t.addEventListener("midimessage",this.midiBootloaderMessage))},midiMainMessage:function(e){this.handleVersionMessage(e)||this.trigger(this.get("midiEventKeys.main"),e.data)},midiBootloaderMessage:function(e){this.handleVersionMessage(e)||this.trigger(this.get("midiEventKeys.bootloader"),e.data)},rebootToBootloader:function(){if("present"===this.get("status")){var e=this.get("productId")
e&&2===e.length&&this.get("mainOutput").send([240,0,32,41,0,113,e[0],e[1],0,0,247])}},buildMessage:function(e){var t=this.get("productId")
if(t&&!(t.length<2))return new Uint8Array([240,0,32,41,t[0],t[1]].concat(e,[247]))},playPreviewNote:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0
if("present"===this.get("status")){var t,n=performance.now()+e,i=n+1e3,r=this.get("mainOutput")
for(t=0;t<16;t++)r.send([144+t,60,100],n),r.send([128+t,60,100],i)}}})
e.default=i}),define("wavetable-editor/services/devices/peak",["exports","wavetable-editor/services/devices/device","wavetable-editor/utils/array-eq"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=t.default.extend({productName:"Peak",productId:[0,126],fPGAVersion:0,ready:Ember.computed.equal("status","present"),observeStatus:Ember.observer("status",function(){this.updateVersion()}),releaseVersion:Ember.computed("firmwareVersion",function(){return this.get("firmwareVersion")<=255?"V1.0":"V1.1"}),needsFirmwareUpdate:Ember.computed("firmwareVersion",function(){var e=this.getProperties("firmwareVersion","latestFirmwareVersion"),t=e.firmwareVersion,n=e.latestFirmwareVersion
return t&&t<n}),needsFPGAUpdate:Ember.computed("fPGAVersion",function(){var e=this.getProperties("fPGAVersion","latestFPGAVersion"),t=e.fPGAVersion,n=e.latestFPGAVersion
return t&&t<n}),isBootloader:function(e){return-1!==e.indexOf("Peak Bootloader")},isConnected:function(e){return-1===e.indexOf("Peak Bootloader")&&-1!==e.indexOf("Peak")},_updateMidiInput:function(e,t){this.set(e,"connected"===t.state?t:null)},_updateMidiOutput:function(e,t){this.set(e,"connected"===t.state?t:null)},fPGAVersionFromBytes:function(e){var t=0
return e.forEach(function(e,n){t+=Math.pow(10,n)*e}),t},handleFPGAVersionMessage:function(e){var t=e.data,i=this.get("productId")
i&&2===i.length&&240===t[0]&&(0,n.default)([0,32,41,0,124,i[0],i[1],64],t.slice(1,9))&&(this.set("fPGAVersion",this.fPGAVersionFromBytes(t.slice(11,15))),this.get("mainInput").removeEventListener("midimessage",this.handleFPGAVersionMessage.bind(this)))},handleVersionMessage:function(e){var t=e.data
if(240===t[0]){if(!(0,n.default)([126,127,6,2,0,32,41,126,0,0,0],e.data.slice(1,12))&&!(0,n.default)([126,0,6,2,0,32,41,126,16,0,0],e.data.slice(1,12)))return
this.set("firmwareVersion",this.versionFromBytes(t.slice(12,16)))
var i=this.get("status")
"present"===i?(this.get("mainInput").removeEventListener("midimessage",this.handleVersionMessage.bind(this)),this.updateFPGAVersion()):"bootloader"===i&&this.get("input").removeEventListener("midimessage",this.handleVersionMessage.bind(this))}},updateFPGAVersion:function(){"present"===this.get("status")&&(this.get("mainInput").addEventListener("midimessage",this.handleFPGAVersionMessage.bind(this)),this.get("mainOutput").send([240,0,32,41,0,124,0,126,68,0,0,0,0,0,0,247]))},updateVersion:function(){if("present"===this.get("status"))this.get("mainInput").addEventListener("midimessage",this.handleVersionMessage.bind(this)),this.get("mainOutput").send([240,126,127,6,1,247])
else{if("bootloader"!==this.get("status"))return void this.set("firmwareVersion",void 0)
this.get("input").addEventListener("midimessage",this.handleVersionMessage.bind(this)),this.get("output").send([240,126,127,6,1,247])}}})
e.default=i}),define("wavetable-editor/services/midi-device",["exports"],function(e){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Service.extend({peak:Ember.inject.service("devices.peak"),init:function(){var e=this
this._super.apply(this,arguments),this.onstatechange=this.onstatechange.bind(this),navigator&&void 0!==navigator.requestMIDIAccess?navigator.requestMIDIAccess({sysex:!0}).then(function(t){return e.midiSuccess(t)},function(t){return e.midiError(t)}):this.midiError("It looks like this browser does not support MIDI communications.")},midiSuccess:function(e){e.onstatechange=this.onstatechange,this.updateMidiPorts(e)},midiError:function(e){"object"===t(e)&&"SecurityError"===e.name?this.set("midiErrorMessage","You must allow Full MIDI access, otherwise this whole thing won't work..."):this.set("midiErrorMessage",e),this.get("reject")&&this.get("reject")(this.get("midiErrorMessage"))},onstatechange:function(e){this.peak.updateMidiPort(e.port)},updateMidiPorts:function(e){var t=this
e.inputs.forEach(function(e){t.peak.updateMidiInput(e)}),e.outputs.forEach(function(e){t.peak.updateMidiOutput(e)})}})
e.default=n}),define("wavetable-editor/services/synth",["exports","wavetable-editor/lib/util"],function(e,t){function n(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t]
return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=Ember.Service.extend({playSoundWave:function(e){if(0!=e.length){e.constructor===Array&&(e=function(e){return function(n){(n%=1)<0&&n++
var i=Math.floor(e.length*n),r=(i+1)%e.length,o=e.length*n%1
return(0,t.slurp)(e[i],e[r],o)}}(function(e){var i=Math.min.apply(Math,n(e)),r=Math.max.apply(Math,n(e))
return e.map(function(e){return(0,t.slurp)(-1,1,(e-i)/(r-i))})}(e)))
for(var i=new AudioContext,r=i.createBuffer(1,44100,44100),o=r.getChannelData(0),a=0;a<r.length;a++){var s=a/44100
o[a]+=e(220*s)}var u=i.createBufferSource()
u.buffer=r
var l=i.createGain()
l.gain.setValueAtTime(.8,i.currentTime),l.gain.exponentialRampToValueAtTime(1e-4,i.currentTime+3),u.connect(l),l.connect(i.destination),u.start(),u.stop(i.currentTime+3)}}})
e.default=i}),define("wavetable-editor/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"Q6EklgHG",block:'{"symbols":[],"statements":[[7,"div"],[9],[0,"\\n  Peak: "],[1,[23,["midiDevice","peak","status"]],false],[0,"\\n"],[10],[0,"\\n\\n"],[1,[21,"wave-draw"],false],[0,"\\n\\n"],[1,[21,"outlet"],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"wavetable-editor/templates/application.hbs"}})
e.default=t}),define("wavetable-editor/templates/components/canvas-display",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"nncMPlP8",block:'{"symbols":["&default"],"statements":[[14,1]],"hasEval":false}',meta:{moduleName:"wavetable-editor/templates/components/canvas-display.hbs"}})
e.default=t}),define("wavetable-editor/templates/components/wave-draw",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"O3OmGYtW",block:'{"symbols":[],"statements":[[7,"div"],[11,"class","controls"],[9],[0,"\\n  "],[7,"input"],[11,"id","wave-draw-slider"],[11,"min","0"],[11,"max","1"],[11,"value","1"],[11,"step","any"],[11,"type","range"],[9],[10],[0,"\\n  "],[7,"button"],[11,"id","wave-draw-button"],[11,"class","button"],[9],[0,"Play Wave"],[3,"action",[[22,0,[]],"playSound"]],[10],[0,"\\n\\n  "],[7,"button"],[12,"disabled",[21,"disableSendButton"]],[9],[0,"Send Sysex"],[3,"action",[[22,0,[]],"sendSysex"]],[10],[0,"\\n  "],[7,"button"],[12,"disabled",[21,"disableDownloadButton"]],[9],[0,"Download Sysex"],[3,"action",[[22,0,[]],"downloadSysex"]],[10],[0,"\\n"],[10],[0,"\\n\\n"],[7,"div"],[11,"class","container"],[9],[0,"\\n  "],[7,"div"],[9],[0,"\\n      "],[7,"canvas"],[11,"id","wave-draw"],[11,"class","sketch-child"],[11,"width","500"],[11,"height","300"],[9],[10],[0,"\\n      "],[7,"p"],[11,"id","wave-draw-instruction"],[11,"class","instruction wave-instruction"],[9],[0,"Draw here!"],[10],[0,"\\n  "],[10],[0,"\\n  "],[7,"div"],[9],[0,"\\n    "],[7,"canvas"],[11,"id","wave-draw-split"],[11,"class","sketch"],[11,"width","500"],[11,"height","500"],[9],[10],[0,"\\n  "],[10],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"wavetable-editor/templates/components/wave-draw.hbs"}})
e.default=t}),define("wavetable-editor/templates/components/waveform-display",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"iwBiHxH+",block:'{"symbols":["&default"],"statements":[[14,1]],"hasEval":false}',meta:{moduleName:"wavetable-editor/templates/components/waveform-display.hbs"}})
e.default=t}),define("wavetable-editor/templates/components/waveform-editor",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"Umiq0ZgO",block:'{"symbols":["&default"],"statements":[[14,1]],"hasEval":false}',meta:{moduleName:"wavetable-editor/templates/components/waveform-editor.hbs"}})
e.default=t}),define("wavetable-editor/utils/array-eq",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,t){var n,i=e.length
if(i!==t.length)return!1
for(n=0;n<i;n++)if(null!=e[n]&&e[n]!==t[n])return!1
return!0}}),define("wavetable-editor/utils/check-manufacturer-id",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e){return 0===e[1]&&32===e[2]&&41===e[3]}}),define("wavetable-editor/utils/download-file",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,t){var n=document.createElement("a")
return n.href=URL.createObjectURL(e),n.download=t,n.click(),URL.revokeObjectURL(n.href),Ember.RSVP.resolve()}}),define("wavetable-editor/utils/midimunge",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.bytesToNybbles=function(e){var t,n=[0,0,0,0,0,0,0,0]
for(t=0;t<8;t++)n[t]=e>>4*(7-t)&15
return n},e.nybblesToBytes=function(e){var t=0
return e.forEach(function(e,n){t+=e*Math.pow(16,7-n)}),t},e.sevenToEight=function(e){var t=[],n=e.length,i=0
for(;i<n;){var r,o,a=e.slice(i,i+8),s=a.slice(1)
for(r=0,o=s.length;r<o;r++){var u=(a[0]&1<<r)>>r
s[r]=s[r]+(u<<7)}t=t.concat(s),i+=8}return t},e.eightToSeven=function(e){var t,n=e.length,i=n+Math.ceil(n/7),r=new Array(i),o=0,a=0
for(;o<n;){for(r[a]=0,t=0;t<7;t++){o+t<n&&(r[a+t+1]=127&e[o+t])
var s=(128&(e[o+t]||0))>>7-t
r[a]|=s}o+=7,a+=8}return r},e.chunkSysEx=function(e){var t=[],n=new Uint8Array(e),i=0,r=0
do{i=n.indexOf(240,r),r=n.indexOf(247,i),-1!==i&&-1!==r&&t.push(e.slice(i,r+1))}while(-1!==i&&-1!==r)
return t}}),define("wavetable-editor/config/environment",[],function(){try{var e="wavetable-editor/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),n={default:JSON.parse(unescape(t))}
return Object.defineProperty(n,"__esModule",{value:!0}),n}catch(i){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("wavetable-editor/app").default.create({name:"wavetable-editor",version:"0.0.0+297bcf2b"})
