import { defineField, defineArrayMember, defineType } from 'sanity';

export const experienceType = defineType({
  type: 'document',
  name: 'experience',
  title: 'Experience',
  fields: [
    defineField({
      type: 'string',
      name: 'company',
      title: 'Company',
      validation: (e) => e.required()
    }),
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      validation: (e) => e.required()
    }),
    defineField({
      type: 'array',
      name: 'description',
      title: 'Description',
      validation: (e) => e.required(),
      of: [defineArrayMember({ type: 'block' })]
    }),
    defineField({
      type: 'date',
      name: 'startdate',
      title: 'Start Date',
      validation: (e) => e.required()
    }),
    defineField({ type: 'date', name: 'enddate', title: 'End Date' })
  ],
  preview: {
    select: {
      title: 'company',
      subtitle: 'title'
    }
  }
});
