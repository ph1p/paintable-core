interface Point {
  x: number;
  y: number;
}
interface RegistryEntry {
  color?: string;
  width?: number;
  points?: Point[];
  type: 'line' | 'clear' | 'eraser';
}
interface Store {
  width?: number;
  height?: number;
  elements: RegistryEntry[];
}

interface Options {
  scope: string;
  color: string;
  // every point index % accuracy
  accuracy: number;
  lineWidth: number;
  threshold: number;
  factor: number;
  isEraser: boolean;
  isActive: boolean;
  canvas: HTMLCanvasElement;
}

export class Paintable {
  scope = 'paintable';
  color = '#000000';
  lineWidth = 5;
  threshold = 0;
  factor = 1;
  accuracy = 4;
  isEraser = false;
  isActive = false;

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private currentX = 0;
  private currentY = 0;
  private startedDrawing = false;
  private thresholdReached = false;

  private pointCoords: Point[] = [];
  private redoList: RegistryEntry[] = [];
  private registry: RegistryEntry[] = [];

  moveEvent: (e: MouseEvent | TouchEvent) => void;
  startEvent: (e: MouseEvent | TouchEvent) => void;
  endEvent: (e: MouseEvent | TouchEvent) => void;

  constructor(options: Partial<Options> = {}) {
    this.moveEvent = this.drawMove.bind(this);
    this.startEvent = this.drawStart.bind(this);
    this.endEvent = this.drawEnd.bind(this);

    this.scope = options.scope || this.scope;
    this.color = options.color || this.color;
    this.lineWidth = options.lineWidth || this.lineWidth;
    this.threshold = options.threshold || this.threshold;
    this.factor = options.factor || this.factor;
    this.isEraser = options.isEraser || this.isEraser;
    this.isActive = options.isActive || this.isActive;
    this.accuracy = options.accuracy || this.accuracy;

    if (options.canvas) {
      this.setCanvas(options.canvas);
    }
  }

  // Init paintable component and set all variables
  public reInit(): void {
    this.clear(false, true);

    this.isActive = false;
    this.pointCoords = [];

    // load current saved canvas registry
    this.load();
  }

  public setCanvas(canvas: HTMLCanvasElement, shouldRegisterEvents = true): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.reInit();

    if (shouldRegisterEvents) {
      this.registerEvents();
    }
  }

  public setAccuracy(accuracy: number): void {
    this.accuracy = accuracy;
  }

  public setFactor(factor: number): void {
    this.factor = factor;
  }

  public setScope(scope: string): void {
    this.scope = scope;
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

  public setEraser(isEraser: boolean): void {
    this.isEraser = isEraser;
  }

  // transform the data before saving
  serialize(data: Store): string {
    const serializedElements = data.elements.map((element: RegistryEntry) => {
      if (element.type === 'line') {
        return {
          ...element,
          points: (((element.points || []) as unknown) as number[]).reduce(
            (prev: number[], point: any) => [...prev, point.x, point.y],
            [],
          ),
        };
      }

      return element;
    });

    return JSON.stringify({
      ...data,
      elements: serializedElements,
    });
  }

  // transform data before loasing
  deserialize(data: string): Store {
    const parsedData = JSON.parse(data);

    parsedData.elements = parsedData.elements.map((element: RegistryEntry) => {
      if (element.type === 'line') {
        let points = undefined;

        if (element?.points) {
          points = [];
          for (let i = 0; i < element?.points?.length; i += 2) {
            points.push({
              x: element?.points?.[i],
              y: element?.points?.[i + 1],
            });
          }
        }

        return {
          ...element,
          points,
        };
      }

      return element;
    });

    return parsedData;
  }

  // Set storage item
  setItem(key: string, value: Store): void {
    localStorage.setItem(key, this.serialize(value));
  }

  // get storage item
  async getItem(key: string): Promise<Store> {
    return new Promise((resolve, reject) => {
      const itemFromStorage = this.deserialize(localStorage.getItem(key) || '');

      if (itemFromStorage.elements.length === 0) {
        this.removeItem(this.scope);
      }

      if (itemFromStorage) {
        resolve(itemFromStorage);
      } else {
        reject();
      }
    });
  }

  //Remove item from storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Get scaling factor of current device
  get scalingFactor(): number {
    return window.devicePixelRatio || 1;
  }

  // Cancel current drawing and remove lines
  public cancel(): void {
    if (this.isActive) {
      this.clear();
      this.load();
      this.isEraser = false;
      this.isActive = false;
    }
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

      this.canvas.addEventListener('mousemove', this.moveEvent);
      this.canvas.addEventListener('mousedown', this.startEvent);
      this.canvas.addEventListener('mouseup', this.endEvent);

      this.canvas.addEventListener('touchmove', this.moveEvent);
      this.canvas.addEventListener('touchstart', this.startEvent);
      this.canvas.addEventListener('touchend', this.endEvent);
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

  /**
   * Draw all entries from registry
   */
  private drawEntriesFromRegistry() {
    this.clearCanvas();

    const clearIndex = this.registry.map((entry) => entry.type).lastIndexOf('clear');
    const allElementSinceLastClear =
      clearIndex <= 0 ? this.registry : this.registry.slice(clearIndex + 1, this.registry.length);

    allElementSinceLastClear.forEach((entry) => {
      if (entry.type === 'line' || entry.type === 'eraser') {
        if (this.ctx) {
          this.ctx.globalCompositeOperation = entry.type === 'eraser' ? 'destination-out' : 'source-over';
        }
        this.drawLine(entry);
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

  /**
   * Clear complete canvas
   * @param keepHistory set true if keep the complete history
   * @param force clear everything no matter if it is active
   */
  clear(keepHistory = false, force = false): void {
    if (this.isActive || force) {
      this.clearCanvas();
      if (keepHistory) {
        this.registry.push({
          type: 'clear',
        });
      } else {
        this.registry = [];
        this.redoList = [];
      }
    }
  }

  // Get canvas registry from storage
  async load(): Promise<void> {
    try {
      const store = await this.getItem(this.scope);
      this.registry = store.elements || [];
      this.drawEntriesFromRegistry();
    } catch {}
  }

  /**
   * Check first, if canvas is empty.
   * If its not empty save it to the storage.
   */
  public save(): void {
    if (this.isActive) {
      // reset to pencil
      this.isEraser = false;

      this.setItem(this.scope, {
        width: this.canvas?.width,
        height: this.canvas?.height,
        elements: this.registry,
      });

      this.redoList = [];
    }
  }

  // Start drawing lines
  private drawStart(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    this.thresholdReached = false;

    if (this.isActive && this.canvas) {
      this.drawEntriesFromRegistry();

      // clear redo list
      this.redoList = [];

      this.startedDrawing = true;

      const x = e instanceof MouseEvent ? e.clientX : e.targetTouches[0].clientX;
      const y = e instanceof MouseEvent ? e.clientY : e.targetTouches[0].clientY;

      if (x && y) {
        this.currentX = (x - this.canvas.getBoundingClientRect().left) * this.factor;
        this.currentY = (y - this.canvas.getBoundingClientRect().top) * this.factor;

        this.pointCoords.push({
          x: this.currentX,
          y: this.currentY,
        });
      }

      if (this.ctx) {
        this.ctx.globalCompositeOperation = this.isEraser ? 'destination-out' : 'source-over';
      }
    }
  }

  // End of drawing a line
  private drawEnd(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    if (this.isActive && this.canvas) {
      const points = this.isEraser
        ? this.pointCoords
        : this.pointCoords.filter((_, i) => i === 0 || i % this.accuracy === 0 || i === this.pointCoords.length - 1);

      this.registry.push({
        width: this.lineWidth,
        color: this.color,
        type: this.isEraser ? 'eraser' : 'line',
        points,
      });

      this.drawEntriesFromRegistry();

      this.startedDrawing = false;

      this.pointCoords = [];
      this.thresholdReached = false;
    }
  }

  // Draw line on move and add current position to an array
  private drawMove(e: MouseEvent | TouchEvent, thresholdReachedCallback: () => void = () => {}) {
    e.preventDefault();
    e.stopPropagation();

    if (this.isActive && this.startedDrawing && this.canvas) {
      const x = e instanceof MouseEvent ? e.clientX : e.targetTouches[0].clientX;
      const y = e instanceof MouseEvent ? e.clientY : e.targetTouches[0].clientY;

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
              thresholdReachedCallback();
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
          points: this.pointCoords,
        });
      }
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
}
