
import type { Camera } from '@/models/camera';

export const cameraHeader = "X-Camera-Name"
export const targetCameraKey = "targetCamera"

// Hono context variables
export type Variables = {
	[targetCameraKey]: Camera;
}

export type Env = {
  Variables: Variables
}
