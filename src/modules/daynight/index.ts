import type { Module } from '@/modules/module';
import { Hono } from 'hono'
import * as constants from '@/constants';
import { CameraMiddleware, CapabilitiesMiddleware } from '@/server/middleware';

// Route imports
import IrCutFilterHandler from './irCutFilterHandler';


const IRModule: Module = {
	name: "IR",
	basePath: "/ir",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const irModule = new Hono<{ Variables: constants.Variables }>();

		irModule.use(CameraMiddleware);

		irModule.on(
			"POST",
			"/filter",
			CapabilitiesMiddleware("IrCutFilter"),
			...IrCutFilterHandler.handle()
		);

    	return irModule;
	},
	Shutdown: (): void => {}
}

export default IRModule;