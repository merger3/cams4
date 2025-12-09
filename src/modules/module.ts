import { Hono, type Handler as HonoHandler } from 'hono'
import type { ZodObject } from "zod"; 
import * as constants from '@/constants';

// Module imports
import PTZModule from './ptz';

export interface Module {
    name: string;
	basePath: string;
    Initialize: (config: {[index: string]: any}) => Hono<{ Variables: constants.Variables }>;
    Shutdown: () => void;
}

export interface Handler {
	adapter: ZodObject;
	handle: () => HonoHandler[];
}


export const modules: Module[] = [
	PTZModule,
];

