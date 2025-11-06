"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
async function routes(fastify) {
    fastify.get('/', async () => {
        return { message: 'Hello World!' };
    });
}
