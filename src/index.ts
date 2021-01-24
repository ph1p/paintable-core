interface Point {
  x: number;
  y: number;
}
interface RegistryEntry {
  color?: string;
  width?: number;
  points?: Point[];
  type: 'line' | 'clear';
}
interface Store {
  width?: number;
  height?: number;
  elements: RegistryEntry[];
}

export class Paintable {
  name = 'paintable';
  color = '#000000';
  lineWidth = 5;
  threshold = 0;

  isMouse = true;
  currentX = 0;
  currentY = 0;

  factor = 1;

  canvasIsEmpty = false;
  canvasId = Math.round(Math.random() * 1000);

  isEraserActive = false;
  isActive = false;

  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  startedDrawing = false;
  thresholdReached = false;

  private pointCoords: Point[] = [];
  private redoList: RegistryEntry[] = [];
  private registry: RegistryEntry[] = [];

  moveEvent: (e: any) => void;
  startEvent: (e: any) => void;
  endEvent: (e: any) => void;

  constructor() {
    this.moveEvent = this.drawMove.bind(this);
    this.startEvent = this.drawStart.bind(this);
    this.endEvent = this.drawEnd.bind(this);

    this.reInit();
  }

  // Init paintable component and set all variables
  public reInit(): void {
    this.isActive = false;
    // reset registry and redo list
    this.registry = [];
    this.redoList = [];

    try {
      this.pointCoords = [];

      // load current saved canvas registry
      this.load();

      // this.$emit('toggle-paintable', this.isActive);
    } catch (err) {
      // this.hide = true;
    }
  }

  public setCanvas(canvas: HTMLCanvasElement, shouldRegisterEvents = true): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    if (shouldRegisterEvents) {
      this.registerEvents();
    }

    this.reInit();
  }

  public setName(name: string): void {
    this.name = name;
    this.reInit();
  }

  public setColor(color: string): void {
    this.color = color;
    if (this.ctx) {
      this.ctx.strokeStyle = color;
    }
  }

  public setActive(active: boolean): void {
    this.isActive = active;
  }

  public setThreshold(threshold: number): void {
    this.threshold = threshold;
  }

  public setLineWidth(lineWidth: number): void {
    this.lineWidth = lineWidth;
    if (this.ctx) {
      this.ctx.lineWidth = lineWidth;
    }
  }

  public setLineWidthEraser(lineWidth: number): void {
    this.lineWidth = lineWidth;
  }

  // Set storage item
  private setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  // get storage item
  private async getItem(key: string): Promise<Store> {
    return new Promise((resolve, reject) => {
      const itemFromStorage = localStorage.getItem(key);

      if (itemFromStorage) {
        resolve(JSON.parse(itemFromStorage));
      } else {
        reject();
      }
    });
  }

  //Remove item from storage
  private removeItem(key: string) {
    localStorage.removeItem(key);
  }

  // Get scaling factor of current device
  get scalingFactor(): number {
    return window.devicePixelRatio || 1;
  }

  // Check if it is a touch device (https://ctrlq.org/code/19616-detect-touch-screen-javascript)
  get isTouch(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  // Cancel current drawing and remove lines
  public cancel(): void {
    this.registry = [];
    this.redoList = [];
    this.load();
    this.isActive = false;
  }

  // register and unregister all events
  private registerEvents() {
    if (this.canvas) {
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
      } else {
        this.canvas.addEventListener('touchmove', this.moveEvent);
        this.canvas.addEventListener('touchstart', this.startEvent);
        this.canvas.addEventListener('touchend', this.endEvent);
      }
    }
  }

  // Undo drawed line
  public undo(): void {
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
  public redo(): void {
    this.undoRedoCanvasState(this.redoList, this.registry);
  }

  // Restore previous state
  private undoRedoCanvasState(listToDelete: RegistryEntry[], listToAdd: RegistryEntry[]) {
    if (listToDelete.length > 0 && this.isActive) {
      listToAdd.push(listToDelete[listToDelete.length - 1]);
      listToDelete.pop();

      if (this.ctx) {
        this.ctx.globalCompositeOperation = 'source-over';
      }

      this.drawEntriesFromRegistry();
    }
  }

  private drawEntriesFromRegistry() {
    this.clearCanvas();

    this.registry.forEach((entry) => {
      if (entry.type === 'line') {
        this.drawLine(entry)
      } else if (entry.type === 'clear') {
        this.clearCanvas();
      }
    });
  }

  private clearCanvas() {
    if (this.canvas) {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // Clear complete canvas
  clear(completeClear = false): void {
    this.clearCanvas();
    if (!completeClear) {
      this.registry.push({
        type: 'clear'
      });
    } else {
      this.registry = [];
      this.redoList = [];
    }
  }

  private isCanvasBlank() {
    if (this.ctx) {
      this.ctx.globalCompositeOperation = 'source-over';
    }

    const blank = document.createElement('canvas');
    const blankCtx = blank.getContext('2d');

    if (this.canvas) {
      blankCtx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

      blank.width = this.canvas.width;
      blank.height = this.canvas.height;

      return blank.toDataURL() === this.canvas.toDataURL();
    }
    return true;
  }

  // Get canvas registry from storage
  async load(): Promise<void> {
    try {
      this.clearCanvas();
      const store = await this.getItem(this.name);
      this.registry = store.elements || [];
      this.drawEntriesFromRegistry();
      this.canvasIsEmpty = this.isCanvasBlank();
    } catch { }
  }

  /**
   * Check first, if canvas is empty.
   * If its not empty save it to the storage.
   */
  public save(): void {
    // reset to pencil
    this.isEraserActive = false;

    if (this.isCanvasBlank()) {
      this.removeItem(this.name);
    } else {
      this.setItem(
        this.name,
        JSON.stringify({
          width: this.canvas?.width,
          height: this.canvas?.height,
          elements: this.registry,
        }),
      );
    }

    this.redoList = [];

    this.canvasIsEmpty = this.isCanvasBlank();
  }

  // Start drawing lines
  private drawStart(e: any) {
    e.preventDefault();
    this.thresholdReached = false;

    if (this.isActive && this.canvas) {
      this.drawEntriesFromRegistry();

      // clear redo list
      this.redoList = [];

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
  private drawEnd() {
    if (this.isActive && this.canvas) {
      const points = this.pointCoords.filter(
        (_, i) => i === 0 || i % 4 === 0 || i === this.pointCoords.length - 1,
      );

      this.registry.push({
        width: this.lineWidth,
        color: this.color,
        type: 'line',
        points,
      });

      this.drawEntriesFromRegistry();

      this.startedDrawing = false;

      this.pointCoords = [];
      this.thresholdReached = false;
    }
  }

  // Generate line from points array
  private drawLine(entry: Partial<RegistryEntry>) {
    if (entry && this.ctx) {
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = entry.width || this.lineWidth;
      this.ctx.strokeStyle = entry.color || this.color;
    }

    if (entry.points && entry.points.length > 0) {
      this.ctx?.beginPath();
      this.ctx?.moveTo(entry.points[0].x, entry.points[0].y);

      for (let point = 0; point < entry.points.length - 1; point++) {
        const p0 = point > 0 ? entry.points[point - 1] : entry.points[0];
        const p1 = entry.points[point];
        const p2 = entry.points[point + 1];
        const p3 = point != (entry.points || []).length - 2 ? entry.points[point + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;

        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        this.ctx?.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
      this.ctx?.stroke();
    }
  }

  // Draw line on move and add current position to an array
  private drawMove(e: any) {
    e.preventDefault();

    if (this.isActive && this.startedDrawing && this.canvas) {
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
          const distanceFirstAndLastPoint = Math.sqrt(
            Math.pow(this.pointCoords[this.pointCoords.length - 1].y - this.pointCoords[0].y, 2) +
            Math.pow(this.pointCoords[this.pointCoords.length - 1].x - this.pointCoords[0].x, 2),
          );

          if (distanceFirstAndLastPoint > this.threshold) {
            if (!this.thresholdReached) {
              this.thresholdReached = true;
              // this.$emit('threshold-reached');
            }
          }
        }


        if (this.ctx) {
          this.ctx.lineCap = 'round';
          this.ctx.lineWidth = this.lineWidth;
          this.ctx.strokeStyle = this.color;
        }

        this.drawLine({
          color: this.color,
          width: this.lineWidth,
          points: this.pointCoords
        });
      }
    }
  }
}
