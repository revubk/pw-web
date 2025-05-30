const config = {
    use: {
      headless: false,
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      screenshot: 'off',
      video: 'retain-on-failure',
      trace: 'retain-on-failure'
    }
  };
  
  module.exports = config;
  