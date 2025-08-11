import { apiClient } from '../core/ApiClient';
import { logger } from '../utils/logger';
export class EventQueue {
    constructor(options = {}) {
        this.queue = [];
        this.flushTimer = null;
        this._isProcessing = false;
        this.retryCount = 0;
        this.options = {
            batchSize: options.batchSize ?? 50,
            flushInterval: options.flushInterval ?? 30000, // 30 seconds
            maxRetries: options.maxRetries ?? 3,
        };
    }
    static getInstance(options) {
        if (!EventQueue.instance) {
            EventQueue.instance = new EventQueue(options);
        }
        return EventQueue.instance;
    }
    addEvent(event) {
        const fullEvent = {
            ...event,
            event_id: this.generateEventId(),
            timestamp: new Date().toISOString(),
        };
        this.queue.push(fullEvent);
        logger.debug(`Event added to queue: ${fullEvent.event_type}`);
        // Start flush timer if not already running
        if (!this.flushTimer) {
            this.startFlushTimer();
        }
        // Flush immediately if batch size reached
        if (this.queue.length >= this.options.batchSize) {
            this.flush();
        }
    }
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    startFlushTimer() {
        this.flushTimer = setTimeout(() => {
            this.flush();
        }, this.options.flushInterval);
    }
    clearFlushTimer() {
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
            this.flushTimer = null;
        }
    }
    async flush() {
        if (this._isProcessing || this.queue.length === 0) {
            return;
        }
        this._isProcessing = true;
        this.clearFlushTimer();
        const eventsToSend = this.queue.splice(0, this.options.batchSize);
        try {
            logger.info(`Flushing ${eventsToSend.length} events to server`);
            const response = await apiClient.post('/api/track/batch', {
                events: eventsToSend,
            });
            if (response.success) {
                logger.info(`Successfully sent ${eventsToSend.length} events`);
                this.retryCount = 0;
            }
            else {
                throw new Error(response.error || 'Failed to send events');
            }
        }
        catch (error) {
            logger.error('Failed to flush events', error);
            // Put events back in queue for retry
            this.queue.unshift(...eventsToSend);
            this.retryCount++;
            if (this.retryCount <= this.options.maxRetries) {
                logger.info(`Retrying in ${this.getRetryDelay()}ms (attempt ${this.retryCount})`);
                setTimeout(() => {
                    this.flush();
                }, this.getRetryDelay());
            }
            else {
                logger.error('Max retries reached, dropping events');
                this.retryCount = 0;
            }
        }
        finally {
            this._isProcessing = false;
            // Restart timer if there are still events in queue
            if (this.queue.length > 0) {
                this.startFlushTimer();
            }
        }
    }
    getRetryDelay() {
        // Exponential backoff: 1s, 2s, 4s
        return Math.min(1000 * Math.pow(2, this.retryCount - 1), 10000);
    }
    getQueueSize() {
        return this.queue.length;
    }
    isProcessing() {
        return this._isProcessing;
    }
    clear() {
        this.queue = [];
        this.clearFlushTimer();
        this.retryCount = 0;
        logger.info('Event queue cleared');
    }
    // Force flush all remaining events
    async forceFlush() {
        while (this.queue.length > 0) {
            await this.flush();
        }
    }
}
export const eventQueue = EventQueue.getInstance();
//# sourceMappingURL=EventQueue.js.map