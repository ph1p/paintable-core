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
    constructor();
    reInit(): void;
    setCanvas(canvas: HTMLCanvasElement, shouldRegisterEvents?: boolean): void;
    setName(name: string): void;
    setColor(color: string): void;
    setActive(active: boolean): void;
    setThreshold(threshold: number): void;
    setLineWidth(lineWidth: number): void;
    setLineWidthEraser(lineWidth: number): void;
    serialize(data: Store): string;
    deserialize(data: string): Store;
    setItem(key: string, value: Store): void;
    getItem(key: string): Promise<Store>;
    removeItem(key: string): void;
    get scalingFactor(): number;
    get isTouch(): boolean;
    cancel(): void;
    private registerEvents;
    undo(): void;
    redo(): void;
    private undoRedoCanvasState;
    private drawEntriesFromRegistry;
    private clearCanvas;
    /**
     * Clear complete canvas
     * @param keepHistory set true if keep the complete history
     * @param force clear everything no matter if it is active
     */
    clear(keepHistory?: boolean, force?: boolean): void;
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
