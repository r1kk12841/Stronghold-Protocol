const { app, BrowserWindow, net, protocol } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

protocol.registerSchemesAsPrivileged([{
  scheme: 'sp',
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
}]);

const webRoot = path.resolve(__dirname, '..', 'native-dist');

function localFile(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl).pathname || '/');
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const candidate = path.resolve(webRoot, relative);
  if (candidate !== webRoot && !candidate.startsWith(webRoot + path.sep)) return null;
  return candidate;
}

app.whenReady().then(async () => {
  protocol.handle('sp', (request) => {
    const file = localFile(request.url);
    return file ? net.fetch(pathToFileURL(file).toString()) : new Response('Not found', { status: 404 });
  });

  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#0c0f0e',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false },
  });
  await win.loadURL('sp://app/');
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
