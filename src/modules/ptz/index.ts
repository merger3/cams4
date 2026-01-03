import { Hono } from "hono";

import * as constants from "@/constants";
import type { Module } from "@/modules/module";
import { CameraMiddleware, CapabilitiesMiddleware } from "@/server/middleware";

import MoveHandler from "./move_handler";
import PanHandler from "./pan_handler";

const PTZModule: Module = {
	name: "PTZ",
	basePath: "/ptz",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const ptzModule = new Hono<{ Variables: constants.Variables }>();

		ptzModule.use(CameraMiddleware);

		ptzModule.on(
			"POST",
			"/move",
			CapabilitiesMiddleware("PTZ"),
			...MoveHandler.handle(),
		);

		ptzModule.on(
			"POST",
			"/pan",
			CapabilitiesMiddleware("PTZ"),
			...PanHandler.handle(),
		);

		return ptzModule;
	},
	Shutdown: (): void => {},
};

export default PTZModule;
