"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function routes(fastify, options) {
    // Rota de exemplo
    fastify.get('/api', async (request, reply) => {
        return { message: 'API is working', timestamp: new Date().toISOString() };
    });
    // Rota de health check
    fastify.get('/health', async (request, reply) => {
        return { status: 'ok', uptime: process.uptime() };
    });
}
exports.default = routes;
