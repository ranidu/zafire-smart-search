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
    },
  ],
  testing: {
    browserHeadless: true
  }
};
