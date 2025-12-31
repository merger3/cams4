# cams4

A TypeScript-based camera management server built with Hono and Node.js, designed to control Axis cameras via VAPIX API.

## Project Overview

This is a web server that provides a RESTful API for managing and controlling IP cameras, particularly Axis cameras. The project uses a modular architecture where different camera capabilities (like PTZ) are implemented as separate modules.

## Tech Stack

- **Runtime**: Node.js (TypeScript)
- **Web Framework**: Hono (lightweight web framework)
- **Build Tool**: Vite with TypeScript plugin
- **Dev Tool**: tsx (TypeScript execution and watch mode)
- **Validation**: Zod for request schema validation

## Project Structure

```
cams4/
├── configs/           # JSON configuration files for cameras
│   └── cameras.json  # Camera definitions with credentials and capabilities
├── src/
│   ├── constants.ts  # Global constants and type definitions
│   ├── utils.ts      # Utility functions (VAPIX API calls)
│   ├── index.ts      # Application entry point
│   ├── managers/     # State and configuration management
│   │   ├── camera_manager.ts   # Camera instance management
│   │   └── config_manager.ts   # Configuration file loading
│   ├── models/       # TypeScript interfaces and types
│   │   └── camera.ts # Camera model definition
│   ├── modules/      # Feature modules
│   │   ├── module.ts # Module interface and registry
│   │   └── ptz/      # PTZ (Pan-Tilt-Zoom) control module
│   │       ├── index.ts        # PTZ module setup
│   │       └── moveHandler.ts  # PTZ movement endpoint handler
│   └── server/       # Server infrastructure
│       ├── server.ts    # Main server class
│       └── middleware/
│           └── camera.ts # Camera resolution middleware
├── dist/             # Build output (generated)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Architecture

### Module System
The project uses a plugin-style module architecture. Each module:
- Implements the `Module` interface (`name`, `basePath`, `Initialize`, `Shutdown`)
- Has its own routes and handlers
- Is registered in `modules` array in `src/modules/module.ts`
- Currently includes: PTZ Module

### Managers
- **ConfigManager**: Loads all JSON configs from `configs/` directory at startup
- **CameraManager**: Maintains a registry of camera instances with their credentials and capabilities

### Request Flow
1. Client sends request with `X-Camera-Name` header
2. `CameraMiddleware` resolves camera from header and adds to context
3. Handler validates request with Zod schema
4. Handler checks camera capabilities
5. VAPIX API call is made to camera
6. Response returned to client

## Configuration

### Camera Configuration Format (`configs/cameras.json`)
```json
{
  "camera_name": {
    "name": "camera_name",
    "address": "192.168.x.x",
    "username": "root",
    "password": "********",
    "capabilities": ["ptz"]
  }
}
```

**Note**: Camera credentials are stored in configs and encoded to base64 at runtime. Keep `configs/` out of version control.

### TypeScript Configuration
- **Module Resolution**: Bundler mode with path aliases (`@/*` → `src/*`)
- **JSX**: React JSX with Hono JSX import source
- **Target**: ESNext with strict mode enabled

## Development

### Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server with watch mode
npm run build        # Build for production
npm start            # Run production build
```

### Development Server
- Runs on `http://localhost:3000`
- Uses `tsx watch` for hot reload during development
- Watch mode automatically restarts on file changes

### Adding a New Module
1. Create module directory in `src/modules/`
2. Implement `Module` interface with `Initialize` and `Shutdown` methods
3. Add routes using Hono's routing API
4. Create handlers implementing the `Handler` interface (with Zod adapter)
5. Register module in `src/modules/module.ts` exports array

### Adding a New Camera Capability
1. Add capability string to camera config in `configs/cameras.json`
2. Use `CheckCapabilities()` in handlers to verify support
3. Build VAPIX URL using appropriate URL builder function
4. Call camera using `makeVAPIXCall()` utility

## API Documentation

### Headers
- `X-Camera-Name`: Required for all camera operations. Must match a camera name in config.

### PTZ Module (`/ptz`)

#### POST `/ptz/move`
Control camera pan/tilt/zoom movements.

**Request Body**:
```json
{
  "direction": "up" | "down" | "left" | "right" | "upleft" | "upright" | "downleft" | "downright" | "home" | "stop"
}
```

**Headers**:
- `X-Camera-Name`: Camera identifier

**Response**: VAPIX API response or URL (in test mode)

**Error Conditions**:
- 400: Camera doesn't support PTZ capability

## VAPIX Integration

The project integrates with Axis VAPIX API for camera control:
- Base URL format: `http://{camera_address}/axis-cgi/com/ptz.cgi`
- Authentication: HTTP Basic Auth (base64 encoded)
- Test mode available via `makeVAPIXCall()` utility (returns URL instead of executing)

### VAPIX Utilities
- `makeVAPIXCall(url, authorization, method, test)`: Execute VAPIX API calls
- `PTZURLBuilder(target, URLParams)`: Build PTZ command URLs

## Key Concepts

### Camera Model
```typescript
{
  name: string;        // Unique identifier
  address: string;     // IP address
  login: string;       // Base64(username:password)
  capabilities: Set<string>; // Supported features
}
```

### Capability System
Cameras declare capabilities (e.g., "ptz") and handlers check requirements using `CheckCapabilities()` before executing commands.

### Context Variables
Hono context carries typed variables:
- `targetCamera`: Resolved Camera instance (added by middleware)

## Build & Deployment

### Build Process
- Vite builds with SSR mode enabled
- Output: `dist/` directory
- Sourcemaps generated for debugging
- Entry point: `src/index.ts`
- Manifest enabled for asset tracking

### Production
```bash
npm run build   # Build to dist/
npm start       # Run production server
```

## Testing

The `makeVAPIXCall` utility has a test mode flag that returns the URL instead of making the actual request, useful for development and testing without cameras.

## Development Notes

- All paths use TypeScript path aliases (`@/*`) resolved by vite-tsconfig-paths
- Server initialization is async (loads configs before starting)
- Middleware runs before all module routes
- Camera credentials are base64 encoded at load time
- Config files are loaded from `configs/` directory at startup

## Security Considerations

- Camera credentials are stored in plaintext JSON (use environment variables or secrets management for production)
- VAPIX calls use HTTP Basic Auth
- No authentication/authorization on API endpoints currently implemented
- `configs/` directory should be gitignored (contains sensitive credentials)
