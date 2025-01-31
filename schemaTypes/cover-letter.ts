import { defineArrayMember, defineField, defineType } from 'sanity';

export const coverLetterType = defineType({
  name: 'coverLetter',
  title: 'Cover Letter',
  type: 'document',
  fields: [
    defineField({
      type: 'reference',
      name: 'logo',
      title: 'Logo',
      description: 'Reference your logo',
      to: [{ type: 'logo' }]
    }),
    defineField({
      type: 'reference',
      name: 'contactInfo',
      title: 'Contact Info',
      description: 'Reference your contact information',
      to: [{ type: 'contactInfo' }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      description: 'The title of the job you are applying for.',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      description: 'The name of the company you are applying to.',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'companyAddress',
      title: 'Company Address',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'The address of the company (optional).'
    }),
    defineField({
      name: 'greeting',
      title: 'Greeting',
      type: 'string',
      description: 'Salutation (e.g., Dear Hiring Manager or specific person’s name).',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'openingParagraph',
      title: 'Opening Paragraph',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Introduction and why you are excited about the role.',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'keyHighlights',
      title: 'Key Highlights',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Key skills or achievements to highlight.'
    }),
    defineField({
      name: 'closingParagraph',
      title: 'Closing Paragraph',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Closing statement and call to action.',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'signOff',
      title: 'Sign-Off',
      type: 'string',
      description: 'How you sign off (e.g., Sincerely, Best regards).',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: 'jobTitle',
      subtitle: 'companyName'
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Untitled',
        subtitle: subtitle || 'No company name provided'
      };
    }
  }
});

export default coverLetterType;
