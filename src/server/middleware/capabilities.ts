import { createMiddleware } from 'hono/factory'
import { type ClientErrorStatusCode } from 'hono/utils/http-status';
import * as constants from '@/constants';
import type { Camera } from '@/models/camera';
import { constants as http } from "http2";

const CapabilitiesMiddleware = (...capabilitiesList: string[]) => {
	return createMiddleware<constants.Env>(async (ctx, next) => {
		// Requires camera middleware first
		let camera: Camera = ctx.get(constants.targetCameraKey);
		let requestedCapabilities = new Set(capabilitiesList);

		let unsupportedCapabilities = requestedCapabilities.difference(camera.capabilities);

		if (unsupportedCapabilities.size > 0) {
			ctx.status(http.HTTP_STATUS_BAD_REQUEST as ClientErrorStatusCode);
			return ctx.text(`Actions not supported on camera: ${Array.from(unsupportedCapabilities).join(', ')}`);
		}

		await next();
	});
}

export default CapabilitiesMiddleware;