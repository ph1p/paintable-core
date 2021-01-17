var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Paintable {
    constructor(canvas, initEvents = true) {
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
    reInit(events = true) {
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
    }
    setName(name) {
        this.name = name;
        this.reInit(false);
    }
    setColor(color) {
        this.color = color;
    }
    setActive(active) {
        this.isActive = active;
    }
    setThreshold(threshold) {
        this.threshold = threshold;
    }
    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth;
    }
    setLineWidthEraser(lineWidth) {
        this.lineWidth = lineWidth;
    }
    // Set storage item
    setItem(key, value) {
        localStorage.setItem(key, value);
    }
    // get storage item
    getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const itemFromStorage = localStorage.getItem(key);
                if (itemFromStorage) {
                    resolve(JSON.parse(itemFromStorage));
                }
                else {
                    reject();
                }
            });
        });
    }
    //Remove item from storage
    removeItem(key) {
        localStorage.removeItem(key);
    }
    // Get scaling factor of current device
    get scalingFactor() {
        return window.devicePixelRatio || 1;
    }
    // Check if it is a touch device (https://ctrlq.org/code/19616-detect-touch-screen-javascript)
    get isTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
    // Cancel current drawing and remove lines
    cancel() {
        this.load();
        this.isActive = false;
        this.isColorPickerOpen = false;
        this.isLineWidthPickerOpen = false;
    }
    // register and unregister all events
    registerEvents() {
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
    }
    // Undo drawed line
    undo() {
        if (this.registry.length > 0 && this.isActive) {
            this.redoList.push(this.registry[this.registry.length - 1]);
            this.registry.pop();
            if (this.ctx) {
                this.ctx.globalCompositeOperation = 'source-over';
            }
            this.drawEntriesFromRegistry();
        }
    }
    // Redo drawed line
    redo() {
        this.undoRedoCanvasState(this.redoList, this.registry);
    }
    // Restore previous state
    undoRedoCanvasState(listToDelete, listToAdd) {
        if (listToDelete.length > 0 && this.isActive) {
            listToAdd.push(listToDelete[listToDelete.length - 1]);
            listToDelete.pop();
            if (this.ctx) {
                this.ctx.globalCompositeOperation = 'source-over';
            }
            this.drawEntriesFromRegistry();
        }
    }
    drawEntriesFromRegistry() {
        this.clear();
        this.registry.forEach((entry) => this.drawLine(entry));
    }
    // Clear complete canvas
    clear() {
        var _a;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    isCanvasBlank() {
        if (this.ctx) {
            this.ctx.globalCompositeOperation = 'source-over';
        }
        const blank = document.createElement('canvas');
        const blankCtx = blank.getContext('2d');
        blankCtx === null || blankCtx === void 0 ? void 0 : blankCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        blank.width = this.canvas.width;
        blank.height = this.canvas.height;
        return blank.toDataURL() === this.canvas.toDataURL();
    }
    // Get canvas registry from storage
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.clear();
                const store = yield this.getItem(this.name);
                this.registry = store.elements || [];
                this.drawEntriesFromRegistry();
                this.canvasIsEmpty = this.isCanvasBlank();
            }
            catch (_a) { }
        });
    }
    /**
     * Check first, if canvas is empty.
     * If its not empty save it to the storage.
     */
    save() {
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
    }
    // Start drawing lines
    drawStart(e) {
        e.preventDefault();
        this.thresholdReached = false;
        if (this.isActive) {
            // clear redo list
            this.redoList = [];
            this.drawEntriesFromRegistry();
            this.isLineWidthPickerOpen = false;
            this.isColorPickerOpen = false;
            this.startedDrawing = true;
            const x = this.isMouse ? e.clientX : e.targetTouches[0].clientX;
            const y = this.isMouse ? e.clientY : e.targetTouches[0].clientY;
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
    }
    // End of drawing a line
    drawEnd() {
        if (this.isActive) {
            const points = this.pointCoords.filter((_, i) => i === 0 || i % 4 === 0 || i === this.pointCoords.length - 1);
            this.registry.push({
                width: this.lineWidth,
                color: this.color,
                points,
            });
            this.drawEntriesFromRegistry();
            this.startedDrawing = false;
            this.pointCoords = [];
            this.thresholdReached = false;
        }
    }
    // Generate line from points array
    drawLine(entry) {
        var _a, _b, _c, _d;
        if (this.ctx) {
            this.ctx.lineCap = 'round';
            this.ctx.lineWidth = entry.width || this.lineWidth;
            this.ctx.strokeStyle = entry.color || this.color;
        }
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.beginPath();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.moveTo(entry.points[0].x, entry.points[0].y);
        for (let point = 0; point < entry.points.length - 1; point++) {
            const p0 = point > 0 ? entry.points[point - 1] : entry.points[0];
            const p1 = entry.points[point];
            const p2 = entry.points[point + 1];
            const p3 = point != entry.points.length - 2 ? entry.points[point + 2] : p2;
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            (_c = this.ctx) === null || _c === void 0 ? void 0 : _c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
        (_d = this.ctx) === null || _d === void 0 ? void 0 : _d.stroke();
    }
    // Draw line on move and add current position to an array
    drawMove(e) {
        e.preventDefault();
        if (this.isActive && this.startedDrawing) {
            const x = !this.isMouse ? e.targetTouches[0].clientX : e.clientX;
            const y = !this.isMouse ? e.targetTouches[0].clientY : e.clientY;
            if (x && y) {
                this.currentX = (x - this.canvas.getBoundingClientRect().left) * this.factor;
                this.currentY = (y - this.canvas.getBoundingClientRect().top) * this.factor;
                this.pointCoords.push({
                    x: this.currentX,
                    y: this.currentY,
                });
                if (this.threshold) {
                    const distanceFirstAndLastPoint = Math.sqrt(Math.pow(this.pointCoords[this.pointCoords.length - 1].y - this.pointCoords[0].y, 2) +
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
    }
}
