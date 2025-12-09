import Server from '@/server/server';
import { modules } from '@/modules/module';

function main(): void {
	let server = new Server(3000);

	// Register modules
	modules.forEach((m) => {
		server.registerModule(m);
	});

	server.startServer();
}

main();