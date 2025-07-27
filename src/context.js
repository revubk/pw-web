import { launchApp, closeApp } from '../src/DriverControls'

let _page;
let _initialized = false;

export async function getPage() {
  if (!_page && _initialized == false) {
    _initialized = true;
    console.log('🚀 Creating NEW browser instance');
    _page = await launchApp();
  }
  return _page;
}

export async function closePage() {
  if (_page) {
    await closeApp();
    _page = null;
  }
}