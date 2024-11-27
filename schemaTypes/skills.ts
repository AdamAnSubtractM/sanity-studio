import { defineField, defineType } from 'sanity';

export const skillsType = defineType({
  type: 'document',
  name: 'skills',
  title: 'Skills',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'The title of this skills section (e.g., "Technical Skills")',
      validation: (rule) => rule.required()
    }),
    defineField({
      type: 'array',
      name: 'skillsContent',
      title: 'Skills Content',
      description: 'Details or categories of skills',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required()
    })
  ]
});
