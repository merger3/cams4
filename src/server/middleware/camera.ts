import { createMiddleware } from 'hono/factory'
import type { Camera } from '@/models/camera';
import * as constants from '@/constants';

const CameraMiddleware = createMiddleware<constants.Env>(async (ctx, next) => {
	const cameraName = ctx.req.header(constants.cameraHeader);
	if (!cameraName) {
		// Error handle
	}

	const cam: Camera = {
		name: cameraName as string,
		login: btoa("username:password")
	}

	ctx.set(constants.targetCameraKey, cam);
	await next();
})

export default CameraMiddleware;