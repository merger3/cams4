import { Hono } from 'hono'
import PTZModule from './ptz';

export interface ModuleServer {

}

export interface Module {
    name: string;
	basePath: string;
    Initialize: (ms: ModuleServer, config: {[index: string]: any}) => Hono;
    Shutdown: () => void;
}



const modules: Module[] = [
	PTZModule,
];

