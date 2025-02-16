import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { inlineSvgInput } from '@focus-reactive/sanity-plugin-inline-svg-input';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'astro-cf-portfolio',
  projectId: '0gpal1hv',
  dataset: 'development',
  plugins: [structureTool(), visionTool(), inlineSvgInput()],
  schema: {
    types: schemaTypes
  },
  studioHost: 'knee-portfolio',
  useCdn: false
});
