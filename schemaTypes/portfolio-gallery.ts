// ./schemas/portfolioGallery.ts
import { defineField, defineArrayMember, defineType } from 'sanity';

export const portfolioGalleryType = defineType({
  name: 'portfolioGallery',
  title: 'Portfolio Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown on the gallery page (e.g., “Work”, “Selected Projects”).',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Optional short intro shown above the grid.'
    }),
    defineField({
      name: 'pieces',
      title: 'Portfolio Pieces',
      type: 'array',
      description: 'Drag to reorder. These references control which projects appear (and in what order).',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'portfolioPiece' }],
          options: { disableNew: true }
        })
      ],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: 'showTagsFilter',
      title: 'Show Tag Filter',
      type: 'boolean',
      initialValue: false,
      description: 'If your UI supports filtering by tag, toggle it here.'
    })
  ],
  preview: {
    select: {
      title: 'title',
      pieces: 'pieces'
    },
    prepare({ title, pieces }) {
      const count = Array.isArray(pieces) ? pieces.length : 0;
      return {
        title: title || 'Portfolio Gallery',
        subtitle: `${count} piece${count === 1 ? '' : 's'}`
      };
    }
  }
});
