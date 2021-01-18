"use strict";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function t(t,i,e,s){return new(e||(e=Promise))((function(n,o){function r(t){try{a(s.next(t))}catch(t){o(t)}}function h(t){try{a(s.throw(t))}catch(t){o(t)}}function a(t){var i;t.done?n(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(r,h)}a((s=s.apply(t,i||[])).next())}))}function i(t,i){var e,s,n,o,r={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return o={next:h(0),throw:h(1),return:h(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function h(o){return function(h){return function(o){if(e)throw new TypeError("Generator is already executing.");for(;r;)try{if(e=1,s&&(n=2&o[0]?s.return:o[0]?s.throw||((n=s.return)&&n.call(s),0):s.next)&&!(n=n.call(s,o[1])).done)return n;switch(s=0,n&&(o=[2&o[0],n.value]),o[0]){case 0:case 1:n=o;break;case 4:return r.label++,{value:o[1],done:!1};case 5:r.label++,s=o[1],o=[0];continue;case 7:o=r.ops.pop(),r.trys.pop();continue;default:if(!(n=r.trys,(n=n.length>0&&n[n.length-1])||6!==o[0]&&2!==o[0])){r=0;continue}if(3===o[0]&&(!n||o[1]>n[0]&&o[1]<n[3])){r.label=o[1];break}if(6===o[0]&&r.label<n[1]){r.label=n[1],n=o;break}if(n&&r.label<n[2]){r.label=n[2],r.ops.push(o);break}n[2]&&r.ops.pop(),r.trys.pop();continue}o=i.call(t,r)}catch(t){o=[6,t],s=0}finally{e=n=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,h])}}}Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(t,i){void 0===i&&(i=!0),this.canvas=t,this.name="paintable",this.isMouse=!0,this.currentX=0,this.currentY=0,this.factor=1,this.color="#000000",this.canvasIsEmpty=!1,this.canvasId=Math.round(1e3*Math.random()),this.isColorPickerOpen=!1,this.isLineWidthPickerOpen=!1,this.isEraserActive=!1,this.isActive=!1,this.pointCoords=[],this.redoList=[],this.lineWidth=10,this.threshold=0,this.ctx=null,this.startedDrawing=!1,this.thresholdReached=!1,this.registry=[],this.moveEvent=this.drawMove.bind(this),this.startEvent=this.drawStart.bind(this),this.endEvent=this.drawEnd.bind(this),this.reInit(i)}return e.prototype.reInit=function(t){void 0===t&&(t=!0),this.isActive=!1,this.registry=[],this.redoList=[];try{this.pointCoords=[],this.ctx=this.canvas.getContext("2d"),this.load(),t&&this.registerEvents()}catch(t){}},e.prototype.setName=function(t){this.name=t,this.reInit(!1)},e.prototype.setColor=function(t){this.color=t},e.prototype.setActive=function(t){this.isActive=t},e.prototype.setThreshold=function(t){this.threshold=t},e.prototype.setLineWidth=function(t){this.lineWidth=t},e.prototype.setLineWidthEraser=function(t){this.lineWidth=t},e.prototype.setItem=function(t,i){localStorage.setItem(t,i)},e.prototype.getItem=function(e){return t(this,void 0,void 0,(function(){return i(this,(function(t){return[2,new Promise((function(t,i){var s=localStorage.getItem(e);s?t(JSON.parse(s)):i()}))]}))}))},e.prototype.removeItem=function(t){localStorage.removeItem(t)},Object.defineProperty(e.prototype,"scalingFactor",{get:function(){return window.devicePixelRatio||1},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"isTouch",{get:function(){return"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0},enumerable:!1,configurable:!0}),e.prototype.cancel=function(){this.load(),this.isActive=!1,this.isColorPickerOpen=!1,this.isLineWidthPickerOpen=!1},e.prototype.registerEvents=function(){this.canvas.removeEventListener("mousemove",this.moveEvent),this.canvas.removeEventListener("mousedown",this.startEvent),this.canvas.removeEventListener("mouseup",this.endEvent),this.canvas.removeEventListener("touchmove",this.moveEvent),this.canvas.removeEventListener("touchstart",this.startEvent),this.canvas.removeEventListener("touchend",this.endEvent),this.isMouse?(this.canvas.addEventListener("mousemove",this.moveEvent),this.canvas.addEventListener("mousedown",this.startEvent),this.canvas.addEventListener("mouseup",this.endEvent)):(this.canvas.addEventListener("touchmove",this.moveEvent),this.canvas.addEventListener("touchstart",this.startEvent),this.canvas.addEventListener("touchend",this.endEvent))},e.prototype.undo=function(){this.registry.length>0&&this.isActive&&(this.redoList.push(this.registry[this.registry.length-1]),this.registry.pop(),this.ctx&&(this.ctx.globalCompositeOperation="source-over"),this.drawEntriesFromRegistry())},e.prototype.redo=function(){this.undoRedoCanvasState(this.redoList,this.registry)},e.prototype.undoRedoCanvasState=function(t,i){t.length>0&&this.isActive&&(i.push(t[t.length-1]),t.pop(),this.ctx&&(this.ctx.globalCompositeOperation="source-over"),this.drawEntriesFromRegistry())},e.prototype.drawEntriesFromRegistry=function(){var t=this;this.clear(),this.registry.forEach((function(i){return t.drawLine(i)}))},e.prototype.clear=function(){var t;null===(t=this.ctx)||void 0===t||t.clearRect(0,0,this.canvas.width,this.canvas.height)},e.prototype.isCanvasBlank=function(){this.ctx&&(this.ctx.globalCompositeOperation="source-over");var t=document.createElement("canvas"),i=t.getContext("2d");return null==i||i.clearRect(0,0,this.canvas.width,this.canvas.height),t.width=this.canvas.width,t.height=this.canvas.height,t.toDataURL()===this.canvas.toDataURL()},e.prototype.load=function(){return t(this,void 0,void 0,(function(){var t;return i(this,(function(i){switch(i.label){case 0:return i.trys.push([0,2,,3]),this.clear(),[4,this.getItem(this.name)];case 1:return t=i.sent(),this.registry=t.elements||[],this.drawEntriesFromRegistry(),this.canvasIsEmpty=this.isCanvasBlank(),[3,3];case 2:return i.sent(),[3,3];case 3:return[2]}}))}))},e.prototype.save=function(){this.isEraserActive=!1,this.isCanvasBlank()?this.removeItem(this.name):this.setItem(this.name,JSON.stringify({width:this.canvas.width,height:this.canvas.height,elements:this.registry})),this.registry=[],this.redoList=[],this.canvasIsEmpty=this.isCanvasBlank()},e.prototype.drawStart=function(t){if(t.preventDefault(),this.thresholdReached=!1,this.isActive){this.redoList=[],this.drawEntriesFromRegistry(),this.isLineWidthPickerOpen=!1,this.isColorPickerOpen=!1,this.startedDrawing=!0;var i=this.isMouse?t.clientX:t.targetTouches[0].clientX,e=this.isMouse?t.clientY:t.targetTouches[0].clientY;i&&e&&(this.currentX=(i-this.canvas.getBoundingClientRect().left)*this.factor,this.currentY=(e-this.canvas.getBoundingClientRect().top)*this.factor,this.pointCoords.push({x:this.currentX,y:this.currentY})),this.ctx&&(this.ctx.globalCompositeOperation=this.isEraserActive?"destination-out":"source-over")}},e.prototype.drawEnd=function(){var t=this;if(this.isActive){var i=this.pointCoords.filter((function(i,e){return 0===e||e%4==0||e===t.pointCoords.length-1}));this.registry.push({width:this.lineWidth,color:this.color,points:i}),this.drawEntriesFromRegistry(),this.startedDrawing=!1,this.pointCoords=[],this.thresholdReached=!1}},e.prototype.drawLine=function(t){var i,e,s,n;this.ctx&&(this.ctx.lineCap="round",this.ctx.lineWidth=t.width||this.lineWidth,this.ctx.strokeStyle=t.color||this.color),null===(i=this.ctx)||void 0===i||i.beginPath(),null===(e=this.ctx)||void 0===e||e.moveTo(t.points[0].x,t.points[0].y);for(var o=0;o<t.points.length-1;o++){var r=o>0?t.points[o-1]:t.points[0],h=t.points[o],a=t.points[o+1],c=o!=t.points.length-2?t.points[o+2]:a,u=h.x+(a.x-r.x)/6,l=h.y+(a.y-r.y)/6,d=a.x-(c.x-h.x)/6,v=a.y-(c.y-h.y)/6;null===(s=this.ctx)||void 0===s||s.bezierCurveTo(u,l,d,v,a.x,a.y)}null===(n=this.ctx)||void 0===n||n.stroke()},e.prototype.drawMove=function(t){if(t.preventDefault(),this.isActive&&this.startedDrawing){var i=this.isMouse?t.clientX:t.targetTouches[0].clientX,e=this.isMouse?t.clientY:t.targetTouches[0].clientY;if(i&&e){if(this.currentX=(i-this.canvas.getBoundingClientRect().left)*this.factor,this.currentY=(e-this.canvas.getBoundingClientRect().top)*this.factor,this.pointCoords.push({x:this.currentX,y:this.currentY}),this.threshold)Math.sqrt(Math.pow(this.pointCoords[this.pointCoords.length-1].y-this.pointCoords[0].y,2)+Math.pow(this.pointCoords[this.pointCoords.length-1].x-this.pointCoords[0].x,2))>this.threshold&&(this.thresholdReached||(this.thresholdReached=!0));this.drawLine({color:this.color,width:this.lineWidth,points:this.pointCoords})}}},e}();exports.Paintable=e;
