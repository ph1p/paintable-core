interface Point {
    x: number;
    y: number;
}
interface RegistryEntry {
    color: string;
    width: number;
    points: Point[];
}
export declare class Paintable {
    private canvas;
    name: string;
    isMouse: boolean;
    currentX: number;
    currentY: number;
    factor: number;
    color: string;
    canvasIsEmpty: boolean;
    canvasId: number;
    isColorPickerOpen: boolean;
    isLineWidthPickerOpen: boolean;
    isEraserActive: boolean;
    isActive: boolean;
    pointCoords: Point[];
    redoList: RegistryEntry[];
    lineWidth: number;
    threshold: number;
    ctx: CanvasRenderingContext2D | null;
    startedDrawing: boolean;
    thresholdReached: boolean;
    registry: RegistryEntry[];
    moveEvent: (e: any) => void;
    startEvent: (e: any) => void;
    endEvent: (e: any) => void;
    constructor(canvas: HTMLCanvasElement, initEvents?: boolean);
    reInit(events?: boolean): void;
    setName(name: string): void;
    setColor(color: string): void;
    setActive(active: boolean): void;
    setThreshold(threshold: number): void;
    setLineWidth(lineWidth: number): void;
    setLineWidthEraser(lineWidth: number): void;
    private setItem;
    private getItem;
    private removeItem;
    get scalingFactor(): number;
    get isTouch(): boolean;
    cancel(): void;
    private registerEvents;
    undo(): void;
    redo(): void;
    private undoRedoCanvasState;
    private drawEntriesFromRegistry;
    clear(): void;
    private isCanvasBlank;
    load(): Promise<void>;
    /**
     * Check first, if canvas is empty.
     * If its not empty save it to the storage.
     */
    save(): void;
    private drawStart;
    private drawEnd;
    private drawLine;
    private drawMove;
}
export {};
