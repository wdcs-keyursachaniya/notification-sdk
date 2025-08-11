"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.config = exports.eventQueue = exports.webSocketClient = exports.apiClient = exports.LogLevel = exports.Logger = exports.Config = exports.EventQueue = exports.WebSocketClient = exports.ApiClient = exports.NotificationManager = exports.default = void 0;
// Export the main SDK singleton
var NotificationManager_1 = require("./core/NotificationManager");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return NotificationManager_1.notificationManager; } });
// Export individual components for advanced usage
var NotificationManager_2 = require("./core/NotificationManager");
Object.defineProperty(exports, "NotificationManager", { enumerable: true, get: function () { return NotificationManager_2.NotificationManager; } });
var ApiClient_1 = require("./core/ApiClient");
Object.defineProperty(exports, "ApiClient", { enumerable: true, get: function () { return ApiClient_1.ApiClient; } });
var WebSocketClient_1 = require("./core/WebSocketClient");
Object.defineProperty(exports, "WebSocketClient", { enumerable: true, get: function () { return WebSocketClient_1.WebSocketClient; } });
var EventQueue_1 = require("./events/EventQueue");
Object.defineProperty(exports, "EventQueue", { enumerable: true, get: function () { return EventQueue_1.EventQueue; } });
var config_1 = require("./config");
Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return config_1.Config; } });
var logger_1 = require("./utils/logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logger_1.LogLevel; } });
// Export all types
__exportStar(require("./types"), exports);
// Export singleton instances
var ApiClient_2 = require("./core/ApiClient");
Object.defineProperty(exports, "apiClient", { enumerable: true, get: function () { return ApiClient_2.apiClient; } });
var WebSocketClient_2 = require("./core/WebSocketClient");
Object.defineProperty(exports, "webSocketClient", { enumerable: true, get: function () { return WebSocketClient_2.webSocketClient; } });
var EventQueue_2 = require("./events/EventQueue");
Object.defineProperty(exports, "eventQueue", { enumerable: true, get: function () { return EventQueue_2.eventQueue; } });
var config_2 = require("./config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_2.config; } });
var logger_2 = require("./utils/logger");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return logger_2.logger; } });
//# sourceMappingURL=index.js.map