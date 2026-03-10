import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as compression from 'compression';
import { existsSync } from 'fs';
import { join } from 'path';

import { AppServerModule } from './src/main.server';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/frontend/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.use(compression());

  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
