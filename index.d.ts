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
    accuracy: number;
    lineWidth: number;
    threshold: number;
    factor: number;
    isEraser: boolean;
    isActive: boolean;
    canvas: HTMLCanvasElement;
}
export declare class Paintable {
    scope: string;
    color: string;
    lineWidth: number;
    threshold: number;
    factor: number;
    accuracy: number;
    isEraser: boolean;
    isActive: boolean;
    private canvas;
    private ctx;
    private currentX;
    private currentY;
    private startedDrawing;
    private thresholdReached;
    private pointCoords;
    private redoList;
    private registry;
    moveEvent: (e: MouseEvent | TouchEvent) => void;
    startEvent: (e: MouseEvent | TouchEvent) => void;
    endEvent: (e: MouseEvent | TouchEvent) => void;
    constructor(options?: Partial<Options>);
    reInit(): void;
    setCanvas(canvas: HTMLCanvasElement, shouldRegisterEvents?: boolean): void;
    setAccuracy(accuracy: number): void;
    setFactor(factor: number): void;
    setScope(scope: string): void;
    setColor(color: string): void;
    setActive(active: boolean): void;
    setThreshold(threshold: number): void;
    setLineWidth(lineWidth: number): void;
    setLineWidthEraser(lineWidth: number): void;
    setEraser(isEraser: boolean): void;
    serialize(data: Store): string;
    deserialize(data: string): Store;
    setItem(key: string, value: Store): void;
    getItem(key: string): Promise<Store>;
    removeItem(key: string): void;
    get scalingFactor(): number;
    cancel(): void;
    private registerEvents;
    undo(): void;
    redo(): void;
    private undoRedoCanvasState;
    /**
     * Draw all entries from registry
     */
    private drawEntriesFromRegistry;
    private clearCanvas;
    /**
     * Clear complete canvas
     * @param keepHistory set true if keep the complete history
     * @param force clear everything no matter if it is active
     */
    clear(keepHistory?: boolean, force?: boolean): void;
    load(): Promise<void>;
    /**
     * Check first, if canvas is empty.
     * If its not empty save it to the storage.
     */
    save(): void;
    private drawStart;
    private drawEnd;
    private drawMove;
    private drawLine;
}
export {};
