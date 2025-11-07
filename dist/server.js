"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const prisma_plugin_1 = __importDefault(require("./prisma/prisma.plugin"));
const accounts_js_1 = __importDefault(require("./routes/accounts.js"));
const app = (0, fastify_1.default)();
app.get('/', async (request, reply) => {
    return { hello: 'world' };
});
const start = async () => {
    try {
        // Registrar o plugin do Prisma antes de iniciar o servidor
        await app.register(prisma_plugin_1.default);
        // Registrar as rotas de accounts
        await app.register(accounts_js_1.default);
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server is running on http://localhost:3000');
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
