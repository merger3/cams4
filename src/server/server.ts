import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import type { Module } from '@/modules/module';
import * as constants from '@/constants';


class Server {
	// public
	readonly app: Hono<{ Variables: constants.Variables }> = new Hono<{ Variables: constants.Variables }>();

	// private
	private readonly port: number;
	private modules: {[key: string]: Module} = {};

	constructor(port: number) {
		this.port = port;
	}

	registerModule(module: Module): void {
		this.modules[module.name] = module;
		this.app.route(module.basePath, module.Initialize({}));
	}

	startServer(): void {
		serve({
			fetch: this.app.fetch,
			port: this.port
		}, (info) => {
			console.log(`Server is running on http://localhost:${info.port}`);
		})
	}
}

export default Server;