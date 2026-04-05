import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'zafire-smart-search',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      dir: 'www',
      indexHtml: 'demo/index.html', // ← point to demo folder
      copy: [
        { src: '../demo/index.html', dest: 'index.html' },
        { src: '../demo/demo.css', dest: 'demo.css' },
        { src: '../demo/demo.js', dest: 'demo.js' },
      ],
    },
  ],
  testing: {
    browserHeadless: true,
  },
};
