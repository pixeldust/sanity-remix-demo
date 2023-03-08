import {Users} from 'lucide-react'
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: Users,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'summary',
      type: 'text',
    }),
    defineField({
      name: 'content',
      type: 'array',
      of: [{type: 'block'}, {type: 'image'}],
    }),
  ],
})
