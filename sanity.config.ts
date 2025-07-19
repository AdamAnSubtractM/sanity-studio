import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { inlineSvgInput } from '@focus-reactive/sanity-plugin-inline-svg-input';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'astro-cf-portfolio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing-sanity-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'development',
  plugins: [structureTool(), visionTool(), inlineSvgInput()],
  schema: {
    types: schemaTypes
  },
  studioHost: process.env.SANITY_STUDIO_HOST,
  useCdn: false
});
