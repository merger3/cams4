import { type ClientErrorStatusCode } from 'hono/utils/http-status';
import { createFactory } from 'hono/factory';
import { constants as http } from "http2";
import * as z from "zod"; 
import * as constants from '@/constants';
import { makeVAPIXCall } from '@/utils';
import { CheckCapabilities, type Handler } from '@/modules/module';
import { PTZURLBuilder } from '.';

const moveAdapter = z.object({ 
	direction: z.enum([
		"upleft",   "up",   "upright", 
		"left",     "home", "right",
		"downleft", "down", "downright",
		"stop"
	]),
})

function handle(): any {
	return createFactory<constants.Env>().createHandlers(async (ctx) => {
		// Error handle
		let move = moveAdapter.parse(await ctx.req.json());
		let camera = ctx.get(constants.targetCameraKey)

		let isCapable: boolean = CheckCapabilities(camera.capabilities, "ptz");
		if (!isCapable) {
			ctx.status(http.HTTP_STATUS_BAD_REQUEST as ClientErrorStatusCode);
			// Make this an actual error
			return ctx.text("Action not supported on camera");
		}

		let url = PTZURLBuilder(camera.name, {move: move.direction});
		let response = await makeVAPIXCall(url, camera.login);

		return ctx.text(response as string)
	})
}

const MoveHandler: Handler = {
	adapter: moveAdapter,
	handle: handle,
}

export default MoveHandler;