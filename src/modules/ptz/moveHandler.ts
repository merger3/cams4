import { createFactory } from 'hono/factory'
import type { Handler } from '../module';
import * as z from "zod"; 
import { makeVAPIXCall } from '@/utils';
import * as constants from '@/constants';

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

		const params = new URLSearchParams({
			camera: "1",
			move: move.direction
		});

		let url = `http://${camera.name}/axis-cgi/com/ptz.cgi?${params.toString()}`;

		let response = await makeVAPIXCall(url, camera.login);

		return ctx.text(response as string)
	})
}

const MoveHandler: Handler = {
	adapter: moveAdapter,
	handle: handle,
}

export default MoveHandler;