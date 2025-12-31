import type { Module } from '@/modules/module';
import { constants as http } from "http2";
import { Hono } from 'hono'
import * as constants from '@/constants';
import CameraMiddleware from '@/server/middleware/camera';

// Route imports
import MoveHandler from './moveHandler';

const PTZModule: Module = {
	name: "PTZ",
	basePath: "/ptz",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const ptzModule = new Hono<{ Variables: constants.Variables }>();

		ptzModule.use(CameraMiddleware);

		ptzModule.on(
			http.HTTP2_METHOD_POST,
			'/move',
			...MoveHandler.handle()
		);

    	return ptzModule;
	},
	Shutdown: (): void => {}
}

export default PTZModule;

export function PTZURLBuilder(target: string, URLParams: any): string {
		const params = new URLSearchParams(Object.assign({
			camera: "1",
		}, URLParams)
	);

	return `http://${target}/axis-cgi/com/ptz.cgi?${params.toString()}`
}