const fs = require('fs').promises;
const path = require('path');

class ResourceLoader {
  constructor() {
    this.locatorsDir = path.resolve(__dirname, '../resources/locators');
    this.pageCache = {};
    this.currentPage = null;
  }

  async loadConfig(keyPath) {
    const configPath = path.resolve(__dirname, '../resources/config.json');
    const rawData = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    return keyPath.split('.').reduce((obj, key) => obj[key], rawData);
  }

  async discoverPageFiles() {
    const findPageFiles = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const files = [];
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...await findPageFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
          files.push(fullPath);
        }
      }
      return files;
    };
    return findPageFiles(this.locatorsDir);
  }

  async setPage(pageName) {
    if (this.pageCache[pageName]) {
      this.currentPage = pageName;
      return this;
    }

    const pageFiles = await this.discoverPageFiles();
    let pageConfig = null;

    for (const filePath of pageFiles) {
      try {
        const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        if (content.page === pageName) {
          pageConfig = content;
          pageConfig.__source = path.relative(this.locatorsDir, filePath);
          break;
        }
      } catch (err) {
        // Optionally log or handle file read/parse errors
        continue;
      }
    }

    if (!pageConfig) {
      throw new Error(`Page config '${pageName}' not found in ${this.locatorsDir} or its subfolders`);
    }

    this.pageCache[pageName] = pageConfig;
    this.currentPage = pageName;
    return this;
  }

  get(elementPath) {
    if (!this.currentPage) {
      throw new Error('No page context set. Call setPage() first.');
    }

    const pageConfig = this.pageCache[this.currentPage];
    const [category, element] = elementPath.split('.');

    if (!pageConfig.elements?.[category]) {
      throw new Error(`Category '${category}' not found in ${this.currentPage} (source: ${pageConfig.__source})`);
    }

    if (!pageConfig.elements[category][element]) {
      throw new Error(`Element '${element}' not found in ${this.currentPage}.${category} (source: ${pageConfig.__source})`);
    }

    return pageConfig.elements[category][element];
  }

  getCurrentPageConfig() {
    if (!this.currentPage) {
      throw new Error('No page context set');
    }
    return this.pageCache[this.currentPage];
  }
}

module.exports = new ResourceLoader();