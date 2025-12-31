import type { Camera } from '@/models/camera';

interface cameraConfig {
	name: string;
	address: string;
	username: string;
	password: string;
	capabilities: string[];
}

var CameraManager = {
	// List functions that pull various configs
	cameras: {} as Record<string, Camera>,

	LoadCamera(newCamera: cameraConfig): void {
		this.cameras[newCamera.name] = {
			name: newCamera.name,
			address: newCamera.address,
			login: btoa(`${newCamera.username}:${newCamera.password}`),
			capabilities: new Set(newCamera.capabilities)
		}
	},

	GetCamera(camera: string): Camera {
		return this.cameras[camera]
	},
}

export default CameraManager;