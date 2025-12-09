import { createFactory } from 'hono/factory'
import * as z from "zod"; 
import * as constants from '@/constants';
import { makeVAPIXCall } from '@/utils';
import { type Handler } from '../module';
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