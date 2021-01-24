export declare class Paintable {
    name: string;
    color: string;
    lineWidth: number;
    threshold: number;
    isMouse: boolean;
    currentX: number;
    currentY: number;
    factor: number;
    canvasIsEmpty: boolean;
    canvasId: number;
    isEraserActive: boolean;
    isActive: boolean;
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    startedDrawing: boolean;
    thresholdReached: boolean;
    private pointCoords;
    private redoList;
    private registry;
    moveEvent: (e: any) => void;
    startEvent: (e: any) => void;
    endEvent: (e: any) => void;
    constructor(initEvents?: boolean);
    reInit(events?: boolean): void;
    setCanvas(canvas: HTMLCanvasElement): void;
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
    private clearCanvas;
    clear(completeClear?: boolean): void;
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
