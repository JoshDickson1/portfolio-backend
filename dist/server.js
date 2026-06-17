"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const app = (0, app_1.createApp)();
app.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`Server running on port ${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
});
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Unhandled rejection:', reason);
    process.exit(1);
});
//# sourceMappingURL=server.js.map