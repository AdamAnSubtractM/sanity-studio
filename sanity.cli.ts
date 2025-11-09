import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing-sanity-project-id',
    dataset: process.env.SANITY_STUDIO_DATASET || 'development'
  },
  deployment: {
    autoUpdates: true
  },
  studioHost: process.env.SANITY_STUDIO_HOST
});
