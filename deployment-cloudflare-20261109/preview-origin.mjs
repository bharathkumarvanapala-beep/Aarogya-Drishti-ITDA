import {createOrigin} from './origin.mjs';
import {fileURLToPath} from 'node:url';
const server = await createOrigin({dist:fileURLToPath(new URL('./preview-site',import.meta.url)),backendPort:4201});
server.on('error', e => {console.error(e.message);process.exitCode=1;});
server.listen(3202,'127.0.0.1',()=>console.log('Synthetic demo gateway: http://127.0.0.1:3202; isolated backend:4201'));
