import type { Module } from '@/modules/module';
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import * as constants from '@/constants';
import CameraMiddleware from '@/server/middleware/camera';

// Route imports
import MoveHandler from './moveHandler';

const PTZModule: Module = {
	name: "PTZ",
	basePath: "/ptz",
	Initialize: (ms, config): Hono<{ Variables: constants.Variables }> => {
		const ptzModule = new Hono<{ Variables: constants.Variables }>();

		ptzModule.on(
			'POST',
			'/move', 
			CameraMiddleware,
			...MoveHandler.handle()
		);

    	return ptzModule;
	},
	Shutdown: (): void => {}
}

export default PTZModule;