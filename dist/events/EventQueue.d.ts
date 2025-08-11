import { TrackingEvent } from '../types';
export interface EventQueueOptions {
    batchSize?: number;
    flushInterval?: number;
    maxRetries?: number;
}
export declare class EventQueue {
    private static instance;
    private queue;
    private flushTimer;
    private _isProcessing;
    private retryCount;
    private options;
    private constructor();
    static getInstance(options?: EventQueueOptions): EventQueue;
    addEvent(event: Omit<TrackingEvent, 'event_id' | 'timestamp'>): void;
    private generateEventId;
    private startFlushTimer;
    private clearFlushTimer;
    flush(): Promise<void>;
    private getRetryDelay;
    getQueueSize(): number;
    isProcessing(): boolean;
    clear(): void;
    forceFlush(): Promise<void>;
}
export declare const eventQueue: EventQueue;
//# sourceMappingURL=EventQueue.d.ts.map