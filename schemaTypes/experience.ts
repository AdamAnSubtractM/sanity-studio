import { defineField, defineArrayMember, defineType } from 'sanity';
import { formatDate } from '../utils/formatDate';

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
      options: {
        dateFormat: 'MMM YYYY'
      },
      validation: (e) => e.required()
    }),
    defineField({
      type: 'date',
      name: 'enddate',
      title: 'End Date',
      options: {
        dateFormat: 'MMM YYYY'
      }
    })
  ],
  preview: {
    select: {
      title: 'company',
      subtitle: 'title',
      startDate: 'startdate',
      endDate: 'enddate'
    },
    prepare({ title, subtitle, startDate, endDate }) {
      return {
        title,
        subtitle: `${subtitle} (${formatDate(startDate)} - ${endDate ? formatDate(endDate) : 'Present'})`
      };
    }
  }
});
