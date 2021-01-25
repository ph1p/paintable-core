!function(t){"use strict";var i=function(){return(i=Object.assign||function(t){for(var i,e=1,s=arguments.length;e<s;e++)for(var n in i=arguments[e])Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n]);return t}).apply(this,arguments)};function e(t,i,e,s){return new(e||(e=Promise))((function(n,o){function r(t){try{a(s.next(t))}catch(t){o(t)}}function h(t){try{a(s.throw(t))}catch(t){o(t)}}function a(t){var i;t.done?n(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(r,h)}a((s=s.apply(t,i||[])).next())}))}function s(t,i){var e,s,n,o,r={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return o={next:h(0),throw:h(1),return:h(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function h(o){return function(h){return function(o){if(e)throw new TypeError("Generator is already executing.");for(;r;)try{if(e=1,s&&(n=2&o[0]?s.return:o[0]?s.throw||((n=s.return)&&n.call(s),0):s.next)&&!(n=n.call(s,o[1])).done)return n;switch(s=0,n&&(o=[2&o[0],n.value]),o[0]){case 0:case 1:n=o;break;case 4:return r.label++,{value:o[1],done:!1};case 5:r.label++,s=o[1],o=[0];continue;case 7:o=r.ops.pop(),r.trys.pop();continue;default:if(!(n=r.trys,(n=n.length>0&&n[n.length-1])||6!==o[0]&&2!==o[0])){r=0;continue}if(3===o[0]&&(!n||o[1]>n[0]&&o[1]<n[3])){r.label=o[1];break}if(6===o[0]&&r.label<n[1]){r.label=n[1],n=o;break}if(n&&r.label<n[2]){r.label=n[2],r.ops.push(o);break}n[2]&&r.ops.pop(),r.trys.pop();continue}o=i.call(t,r)}catch(t){o=[6,t],s=0}finally{e=n=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,h])}}}var n=function(){function t(){this.name="paintable",this.color="#000000",this.lineWidth=5,this.threshold=0,this.isMouse=!0,this.currentX=0,this.currentY=0,this.factor=1,this.canvasIsEmpty=!1,this.canvasId=Math.round(1e3*Math.random()),this.isEraserActive=!1,this.isActive=!1,this.canvas=null,this.ctx=null,this.startedDrawing=!1,this.thresholdReached=!1,this.pointCoords=[],this.redoList=[],this.registry=[],this.moveEvent=this.drawMove.bind(this),this.startEvent=this.drawStart.bind(this),this.endEvent=this.drawEnd.bind(this),this.reInit()}return t.prototype.reInit=function(){this.clear(!1,!0),this.isActive=!1;try{this.pointCoords=[],this.load()}catch(t){}},t.prototype.setCanvas=function(t,i){void 0===i&&(i=!0),this.canvas=t,this.ctx=t.getContext("2d"),i&&this.registerEvents(),this.reInit()},t.prototype.setName=function(t){this.name=t,this.reInit()},t.prototype.setColor=function(t){this.color=t,this.ctx&&(this.ctx.strokeStyle=t)},t.prototype.setActive=function(t){this.isActive=t},t.prototype.setThreshold=function(t){this.threshold=t},t.prototype.setLineWidth=function(t){this.lineWidth=t,this.ctx&&(this.ctx.lineWidth=t)},t.prototype.setLineWidthEraser=function(t){this.lineWidth=t},t.prototype.serialize=function(t){return t.elements=t.elements.map((function(t){var e;return"line"===t.type?i(i({},t),{points:null===(e=t.points)||void 0===e?void 0:e.reduce((function(t,i){return function(){for(var t=0,i=0,e=arguments.length;i<e;i++)t+=arguments[i].length;var s=Array(t),n=0;for(i=0;i<e;i++)for(var o=arguments[i],r=0,h=o.length;r<h;r++,n++)s[n]=o[r];return s}(t,[i.x,i.y])}),[])}):t})),JSON.stringify(t)},t.prototype.deserialize=function(t){var e=JSON.parse(t);return e.elements=e.elements.map((function(t){var e,s,n;if("line"===t.type){var o=void 0;if(null==t?void 0:t.points){o=[];for(var r=0;r<(null===(e=null==t?void 0:t.points)||void 0===e?void 0:e.length);r+=2)o.push({x:null===(s=null==t?void 0:t.points)||void 0===s?void 0:s[r],y:null===(n=null==t?void 0:t.points)||void 0===n?void 0:n[r+1]})}return i(i({},t),{points:o})}return t})),e},t.prototype.setItem=function(t,i){localStorage.setItem(t,this.serialize(i))},t.prototype.getItem=function(t){return e(this,void 0,void 0,(function(){var i=this;return s(this,(function(e){return[2,new Promise((function(e,s){var n=i.deserialize(localStorage.getItem(t)||"");n?e(n):s()}))]}))}))},t.prototype.removeItem=function(t){localStorage.removeItem(t)},Object.defineProperty(t.prototype,"scalingFactor",{get:function(){return window.devicePixelRatio||1},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"isTouch",{get:function(){return"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0},enumerable:!1,configurable:!0}),t.prototype.cancel=function(){this.isActive&&(this.clear(),this.load(),this.isActive=!1)},t.prototype.registerEvents=function(){this.canvas&&(this.canvas.removeEventListener("mousemove",this.moveEvent),this.canvas.removeEventListener("mousedown",this.startEvent),this.canvas.removeEventListener("mouseup",this.endEvent),this.canvas.removeEventListener("touchmove",this.moveEvent),this.canvas.removeEventListener("touchstart",this.startEvent),this.canvas.removeEventListener("touchend",this.endEvent),this.isMouse?(this.canvas.addEventListener("mousemove",this.moveEvent),this.canvas.addEventListener("mousedown",this.startEvent),this.canvas.addEventListener("mouseup",this.endEvent)):(this.canvas.addEventListener("touchmove",this.moveEvent),this.canvas.addEventListener("touchstart",this.startEvent),this.canvas.addEventListener("touchend",this.endEvent)))},t.prototype.undo=function(){this.registry.length>0&&this.isActive&&(this.redoList.push(this.registry[this.registry.length-1]),this.registry.pop(),this.ctx&&(this.ctx.globalCompositeOperation="source-over"),this.drawEntriesFromRegistry())},t.prototype.redo=function(){this.undoRedoCanvasState(this.redoList,this.registry)},t.prototype.undoRedoCanvasState=function(t,i){t.length>0&&this.isActive&&(i.push(t[t.length-1]),t.pop(),this.ctx&&(this.ctx.globalCompositeOperation="source-over"),this.drawEntriesFromRegistry())},t.prototype.drawEntriesFromRegistry=function(){var t=this;this.clearCanvas(),this.registry.forEach((function(i){"line"===i.type?t.drawLine(i):"clear"===i.type&&t.clearCanvas()}))},t.prototype.clearCanvas=function(){var t;this.canvas&&this.isActive&&(null===(t=this.ctx)||void 0===t||t.clearRect(0,0,this.canvas.width,this.canvas.height))},t.prototype.clear=function(t,i){void 0===t&&(t=!1),void 0===i&&(i=!1),(this.isActive||i)&&(this.clearCanvas(),t?this.registry.push({type:"clear"}):(this.registry=[],this.redoList=[]))},t.prototype.isCanvasBlank=function(){this.ctx&&(this.ctx.globalCompositeOperation="source-over");var t=document.createElement("canvas"),i=t.getContext("2d");return!this.canvas||(null==i||i.clearRect(0,0,this.canvas.width,this.canvas.height),t.width=this.canvas.width,t.height=this.canvas.height,t.toDataURL()===this.canvas.toDataURL())},t.prototype.load=function(){return e(this,void 0,void 0,(function(){var t;return s(this,(function(i){switch(i.label){case 0:return i.trys.push([0,2,,3]),this.clearCanvas(),[4,this.getItem(this.name)];case 1:return t=i.sent(),this.registry=t.elements||[],this.drawEntriesFromRegistry(),this.canvasIsEmpty=this.isCanvasBlank(),[3,3];case 2:return i.sent(),[3,3];case 3:return[2]}}))}))},t.prototype.save=function(){var t,i;this.isActive&&(this.isEraserActive=!1,this.isCanvasBlank()?this.removeItem(this.name):this.setItem(this.name,{width:null===(t=this.canvas)||void 0===t?void 0:t.width,height:null===(i=this.canvas)||void 0===i?void 0:i.height,elements:this.registry}),this.redoList=[],this.canvasIsEmpty=this.isCanvasBlank())},t.prototype.drawStart=function(t){if(t.preventDefault(),this.thresholdReached=!1,this.isActive&&this.canvas){this.drawEntriesFromRegistry(),this.redoList=[],this.startedDrawing=!0;var i=this.isMouse?t.clientX:t.targetTouches[0].clientX,e=this.isMouse?t.clientY:t.targetTouches[0].clientY;i&&e&&(this.currentX=(i-this.canvas.getBoundingClientRect().left)*this.factor,this.currentY=(e-this.canvas.getBoundingClientRect().top)*this.factor,this.pointCoords.push({x:this.currentX,y:this.currentY})),this.ctx&&(this.ctx.globalCompositeOperation=this.isEraserActive?"destination-out":"source-over")}},t.prototype.drawEnd=function(){var t=this;if(this.isActive&&this.canvas){var i=this.pointCoords.filter((function(i,e){return 0===e||e%4==0||e===t.pointCoords.length-1}));this.registry.push({width:this.lineWidth,color:this.color,type:"line",points:i}),this.drawEntriesFromRegistry(),this.startedDrawing=!1,this.pointCoords=[],this.thresholdReached=!1}},t.prototype.drawLine=function(t){var i,e,s,n;if(t&&this.ctx&&(this.ctx.lineCap="round",this.ctx.lineWidth=t.width||this.lineWidth,this.ctx.strokeStyle=t.color||this.color),t.points&&t.points.length>0){null===(i=this.ctx)||void 0===i||i.beginPath(),null===(e=this.ctx)||void 0===e||e.moveTo(t.points[0].x,t.points[0].y);for(var o=0;o<t.points.length-1;o++){var r=o>0?t.points[o-1]:t.points[0],h=t.points[o],a=t.points[o+1],c=o!=(t.points||[]).length-2?t.points[o+2]:a,l=h.x+(a.x-r.x)/6,u=h.y+(a.y-r.y)/6,v=a.x-(c.x-h.x)/6,d=a.y-(c.y-h.y)/6;null===(s=this.ctx)||void 0===s||s.bezierCurveTo(l,u,v,d,a.x,a.y)}null===(n=this.ctx)||void 0===n||n.stroke()}},t.prototype.drawMove=function(t){if(t.preventDefault(),this.isActive&&this.startedDrawing&&this.canvas){var i=this.isMouse?t.clientX:t.targetTouches[0].clientX,e=this.isMouse?t.clientY:t.targetTouches[0].clientY;if(i&&e){if(this.currentX=(i-this.canvas.getBoundingClientRect().left)*this.factor,this.currentY=(e-this.canvas.getBoundingClientRect().top)*this.factor,this.pointCoords.push({x:this.currentX,y:this.currentY}),this.threshold)Math.sqrt(Math.pow(this.pointCoords[this.pointCoords.length-1].y-this.pointCoords[0].y,2)+Math.pow(this.pointCoords[this.pointCoords.length-1].x-this.pointCoords[0].x,2))>this.threshold&&(this.thresholdReached||(this.thresholdReached=!0));this.ctx&&(this.ctx.lineCap="round",this.ctx.lineWidth=this.lineWidth,this.ctx.strokeStyle=this.color),this.drawLine({color:this.color,width:this.lineWidth,points:this.pointCoords})}}},t}();t.Paintable=n}(this.window=this.window||{});
