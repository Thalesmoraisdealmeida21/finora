"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const fastify = (0, fastify_1.default)({
    logger: true
});
// Rota raiz
fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
});
/**
 * Run the server!
 */
const start = async () => {
    try {
        // Registrar rotas como middleware
        await fastify.register(index_js_1.default);
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server is running on http://localhost:3000');
    }
    catch (err) {
        fastify.log.error(err);
    }
};
start();
