import Server from '@/server/server';
import { modules } from '@/modules/module';

async function main(): Promise<void> {
	let server = new Server(3000);

	await server.initializeManagers();

	// Register modules
	modules.forEach((m) => {
		server.registerModule(m);
	});


	server.startServer();
}

main();