import { createMiddleware } from 'hono/factory'
import type { Camera } from '@/models/camera';
import * as constants from '@/constants';

import { CameraManager } from '@/managers';

const CameraMiddleware = createMiddleware<constants.Env>(async (ctx, next) => {
	const cameraName = ctx.req.header(constants.cameraHeader);
	if (!cameraName) {
		// Error handle
	}

	const cam = CameraManager.GetCamera(cameraName as string)

	// Handle the case that no matching cam is found

	ctx.set(constants.targetCameraKey, cam);
	await next();
})

export default CameraMiddleware;