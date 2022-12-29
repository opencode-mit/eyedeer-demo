import assert from "assert";
import { WebServer } from './WebServer';

async function main(): Promise<void> {
    const server: WebServer = new WebServer(8888);
    await server.start();
    assert(server.server !== undefined);
}

if (require.main === module) {
    void main();
}
