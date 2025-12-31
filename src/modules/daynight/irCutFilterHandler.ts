import { type ClientErrorStatusCode } from 'hono/utils/http-status';
import { createFactory } from 'hono/factory';
import { constants as http } from "http2";
import * as z from "zod"; 
import * as constants from '@/constants';
import { makeVAPIXCall, VAPIXURLBuilder } from '@/utils';
import { type Handler } from '@/modules/module';
import { CapabilitiesMiddleware } from '@/server/middleware';


const IrCutFilterAdapter = z.object({ 
	state: z.enum([
		"on",  
		"off",    
		"auto"
	]),
})

function handle(): any {
	return createFactory<constants.Env>().createHandlers(async (ctx) => {
		// Error handle
		let irFilter = IrCutFilterAdapter.parse(await ctx.req.json());
		let camera = ctx.get(constants.targetCameraKey)

		let url = VAPIXURLBuilder("ptz", camera.name, {IrCutFilter: irFilter.state});
		let response = await makeVAPIXCall(url, camera.login);

		return ctx.text(response as string)
	})
}

const IrCutFilterHandler: Handler = {
	adapter: IrCutFilterAdapter,
	handle: handle,
}

export default IrCutFilterHandler;