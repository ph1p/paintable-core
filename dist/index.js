"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paintable = void 0;
var Paintable = /** @class */ (function () {
    function Paintable(canvas, initEvents) {
        if (initEvents === void 0) { initEvents = true; }
        this.canvas = canvas;
        this.name = 'paintable';
        this.isMouse = true;
        this.currentX = 0;
        this.currentY = 0;
        this.factor = 1;
        this.color = '#000000';
        this.canvasIsEmpty = false;
        this.canvasId = Math.round(Math.random() * 1000);
        this.isColorPickerOpen = false;
        this.isLineWidthPickerOpen = false;
        this.isEraserActive = false;
        this.isActive = false;
        this.pointCoords = [];
        this.redoList = [];
        this.lineWidth = 10;
        this.threshold = 0;
        this.ctx = null;
        this.startedDrawing = false;
        this.thresholdReached = false;
        this.registry = [];
        this.moveEvent = this.drawMove.bind(this);
        this.startEvent = this.drawStart.bind(this);
        this.endEvent = this.drawEnd.bind(this);
        this.reInit(initEvents);
    }
    // Init paintable component and set all variables
    Paintable.prototype.reInit = function (events) {
        if (events === void 0) { events = true; }
        this.isActive = false;
        // reset registry and redo list
        this.registry = [];
        this.redoList = [];
        try {
            this.pointCoords = [];
            this.ctx = this.canvas.getContext('2d');
            // load current saved canvas registry
            this.load();
            if (events) {
                this.registerEvents();
            }
            // this.$emit('toggle-paintable', this.isActive);
        }
        catch (err) {
            // this.hide = true;
            // this.hidePaintableNavigation = true;
        }
    };
    Paintable.prototype.setName = function (name) {
        this.name = name;
        this.reInit(false);
    };
    Paintable.prototype.setColor = function (color) {
        this.color = color;
    };
    Paintable.prototype.setActive = function (active) {
        this.isActive = active;
    };
    Paintable.prototype.setThreshold = function (threshold) {
        this.threshold = threshold;
    };
    Paintable.prototype.setLineWidth = function (lineWidth) {
        this.lineWidth = lineWidth;
    };
    Paintable.prototype.setLineWidthEraser = function (lineWidth) {
        this.lineWidth = lineWidth;
    };
    // Set storage item
    Paintable.prototype.setItem = function (key, value) {
        localStorage.setItem(key, value);
    };
    // get storage item
    Paintable.prototype.getItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var itemFromStorage = localStorage.getItem(key);
                        if (itemFromStorage) {
                            resolve(JSON.parse(itemFromStorage));
                        }
                        else {
                            reject();
                        }
                    })];
            });
        });
    };
    //Remove item from storage
    Paintable.prototype.removeItem = function (key) {
        localStorage.removeItem(key);
    };
    Object.defineProperty(Paintable.prototype, "scalingFactor", {
        // Get scaling factor of current device
        get: function () {
            return window.devicePixelRatio || 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paintable.prototype, "isTouch", {
        // Check if it is a touch device (https://ctrlq.org/code/19616-detect-touch-screen-javascript)
        get: function () {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        },
        enumerable: false,
        configurable: true
    });
    // Cancel current drawing and remove lines
    Paintable.prototype.cancel = function () {
        this.load();
        this.isActive = false;
        this.isColorPickerOpen = false;
        this.isLineWidthPickerOpen = false;
    };
    // register and unregister all events
    Paintable.prototype.registerEvents = function () {
        this.canvas.removeEventListener('mousemove', this.moveEvent);
        this.canvas.removeEventListener('mousedown', this.startEvent);
        this.canvas.removeEventListener('mouseup', this.endEvent);
        this.canvas.removeEventListener('touchmove', this.moveEvent);
        this.canvas.removeEventListener('touchstart', this.startEvent);
        this.canvas.removeEventListener('touchend', this.endEvent);
        if (this.isMouse) {
            this.canvas.addEventListener('mousemove', this.moveEvent);
            this.canvas.addEventListener('mousedown', this.startEvent);
            this.canvas.addEventListener('mouseup', this.endEvent);
        }
        else {
            this.canvas.addEventListener('touchmove', this.moveEvent);
            this.canvas.addEventListener('touchstart', this.startEvent);
            this.canvas.addEventListener('touchend', this.endEvent);
        }
    };
    // Undo drawed line
    Paintable.prototype.undo = function () {
        if (this.registry.length > 0 && this.isActive) {
            this.redoList.push(this.registry[this.registry.length - 1]);
            this.registry.pop();
            if (this.ctx) {
                this.ctx.globalCompositeOperation = 'source-over';
            }
            this.drawEntriesFromRegistry();
        }
    };
    // Redo drawed line
    Paintable.prototype.redo = function () {
        this.undoRedoCanvasState(this.redoList, this.registry);
    };
    // Restore previous state
    Paintable.prototype.undoRedoCanvasState = function (listToDelete, listToAdd) {
        if (listToDelete.length > 0 && this.isActive) {
            listToAdd.push(listToDelete[listToDelete.length - 1]);
            listToDelete.pop();
            if (this.ctx) {
                this.ctx.globalCompositeOperation = 'source-over';
            }
            this.drawEntriesFromRegistry();
        }
    };
    Paintable.prototype.drawEntriesFromRegistry = function () {
        var _this = this;
        this.clear();
        this.registry.forEach(function (entry) { return _this.drawLine(entry); });
    };
    // Clear complete canvas
    Paintable.prototype.clear = function () {
        var _a;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Paintable.prototype.isCanvasBlank = function () {
        if (this.ctx) {
            this.ctx.globalCompositeOperation = 'source-over';
        }
        var blank = document.createElement('canvas');
        var blankCtx = blank.getContext('2d');
        blankCtx === null || blankCtx === void 0 ? void 0 : blankCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        blank.width = this.canvas.width;
        blank.height = this.canvas.height;
        return blank.toDataURL() === this.canvas.toDataURL();
    };
    // Get canvas registry from storage
    Paintable.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var store, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.clear();
                        return [4 /*yield*/, this.getItem(this.name)];
                    case 1:
                        store = _b.sent();
                        this.registry = store.elements || [];
                        this.drawEntriesFromRegistry();
                        this.canvasIsEmpty = this.isCanvasBlank();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check first, if canvas is empty.
     * If its not empty save it to the storage.
     */
    Paintable.prototype.save = function () {
        // reset to pencil
        this.isEraserActive = false;
        if (this.isCanvasBlank()) {
            this.removeItem(this.name);
        }
        else {
            this.setItem(this.name, JSON.stringify({
                width: this.canvas.width,
                height: this.canvas.height,
                elements: this.registry,
            }));
        }
        this.registry = [];
        this.redoList = [];
        this.canvasIsEmpty = this.isCanvasBlank();
    };
    // Start drawing lines
    Paintable.prototype.drawStart = function (e) {
        e.preventDefault();
        this.thresholdReached = false;
        if (this.isActive) {
            // clear redo list
            this.redoList = [];
            this.drawEntriesFromRegistry();
            this.isLineWidthPickerOpen = false;
            this.isColorPickerOpen = false;
            this.startedDrawing = true;
            var x = this.isMouse ? e.clientX : e.targetTouches[0].clientX;
            var y = this.isMouse ? e.clientY : e.targetTouches[0].clientY;
            if (x && y) {
                this.currentX = (x - this.canvas.getBoundingClientRect().left) * this.factor;
                this.currentY = (y - this.canvas.getBoundingClientRect().top) * this.factor;
                this.pointCoords.push({
                    x: this.currentX,
                    y: this.currentY,
                });
            }
            if (this.ctx) {
                this.ctx.globalCompositeOperation = this.isEraserActive ? 'destination-out' : 'source-over';
            }
        }
    };
    // End of drawing a line
    Paintable.prototype.drawEnd = function () {
        var _this = this;
        if (this.isActive) {
            var points = this.pointCoords.filter(function (_, i) { return i === 0 || i % 4 === 0 || i === _this.pointCoords.length - 1; });
            this.registry.push({
                width: this.lineWidth,
                color: this.color,
                points: points,
            });
            this.drawEntriesFromRegistry();
            this.startedDrawing = false;
            this.pointCoords = [];
            this.thresholdReached = false;
        }
    };
    // Generate line from points array
    Paintable.prototype.drawLine = function (entry) {
        var _a, _b, _c, _d;
        if (this.ctx) {
            this.ctx.lineCap = 'round';
            this.ctx.lineWidth = entry.width || this.lineWidth;
            this.ctx.strokeStyle = entry.color || this.color;
        }
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.beginPath();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.moveTo(entry.points[0].x, entry.points[0].y);
        for (var point = 0; point < entry.points.length - 1; point++) {
            var p0 = point > 0 ? entry.points[point - 1] : entry.points[0];
            var p1 = entry.points[point];
            var p2 = entry.points[point + 1];
            var p3 = point != entry.points.length - 2 ? entry.points[point + 2] : p2;
            var cp1x = p1.x + (p2.x - p0.x) / 6;
            var cp1y = p1.y + (p2.y - p0.y) / 6;
            var cp2x = p2.x - (p3.x - p1.x) / 6;
            var cp2y = p2.y - (p3.y - p1.y) / 6;
            (_c = this.ctx) === null || _c === void 0 ? void 0 : _c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
        (_d = this.ctx) === null || _d === void 0 ? void 0 : _d.stroke();
    };
    // Draw line on move and add current position to an array
    Paintable.prototype.drawMove = function (e) {
        e.preventDefault();
        if (this.isActive && this.startedDrawing) {
            var x = !this.isMouse ? e.targetTouches[0].clientX : e.clientX;
            var y = !this.isMouse ? e.targetTouches[0].clientY : e.clientY;
            if (x && y) {
                this.currentX = (x - this.canvas.getBoundingClientRect().left) * this.factor;
                this.currentY = (y - this.canvas.getBoundingClientRect().top) * this.factor;
                this.pointCoords.push({
                    x: this.currentX,
                    y: this.currentY,
                });
                if (this.threshold) {
                    var distanceFirstAndLastPoint = Math.sqrt(Math.pow(this.pointCoords[this.pointCoords.length - 1].y - this.pointCoords[0].y, 2) +
                        Math.pow(this.pointCoords[this.pointCoords.length - 1].x - this.pointCoords[0].x, 2));
                    if (distanceFirstAndLastPoint > this.threshold) {
                        if (!this.thresholdReached) {
                            this.thresholdReached = true;
                            // this.$emit('threshold-reached');
                        }
                    }
                }
                // this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawLine({
                    color: this.color,
                    width: this.lineWidth,
                    points: this.pointCoords,
                });
            }
        }
    };
    return Paintable;
}());
exports.Paintable = Paintable;
