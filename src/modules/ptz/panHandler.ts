import { type ClientErrorStatusCode } from 'hono/utils/http-status';
import { createFactory } from 'hono/factory';
import { constants as http } from "http2";
import * as z from "zod"; 
import * as constants from '@/constants';
import { makeVAPIXCall, VAPIXURLBuilder } from '@/utils';
import { type Handler } from '@/modules/module';
import { CapabilitiesMiddleware } from '@/server/middleware';

const panAdapter = z.object({ 
	degrees: z.number().min(-180.0)
	.and(z.number().max(180.0)),
})

function handle(): any {
	return createFactory<constants.Env>().createHandlers(async (ctx) => {
		// Error handle
		let pan = panAdapter.parse(await ctx.req.json());
		let camera = ctx.get(constants.targetCameraKey) // Verify that it exists

		let url = VAPIXURLBuilder("ptz", camera.name, {pan: pan.degrees});
		let response = await makeVAPIXCall(url, camera.login);

		return ctx.text(response as string)
	})
}

const PanHandler: Handler = {
	adapter: panAdapter,
	handle: handle,
}

export default PanHandler;