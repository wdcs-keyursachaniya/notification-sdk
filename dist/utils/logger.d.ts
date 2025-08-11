export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export interface LoggerOptions {
    level?: LogLevel;
    prefix?: string;
    enabled?: boolean;
}
export declare class Logger {
    private level;
    private prefix;
    private enabled;
    constructor(options?: LoggerOptions);
    private formatMessage;
    private log;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    setLevel(level: LogLevel): void;
    setEnabled(enabled: boolean): void;
}
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map