import {z} from 'zod'
import {recordStubZ} from './record'

export const artistZ = z.object({
  _id: z.string(),
  title: z.string().nullable(),
  slug: z.string().nullable(),
  // ...being a touch lazy here, these could be more strongly typed
  image: z.any().nullable(),
  content: z.array(z.any()).nullable(),
  summary: z.string().nullable(),
  records: z.array(recordStubZ),
})

export type ArtistDocument = z.infer<typeof artistZ>

export const artistsZ = z.array(artistZ)