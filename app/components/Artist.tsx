import React from 'react'
import {definePreview} from '@sanity/preview-kit'

import SanityContent from '~/components/SanityContent'
import {projectDetails} from '~/sanity/projectDetails'
import Layout from '~/components/Layout'
import Title from '~/components/Title'
import ExitPreview from './ExitPreview'
import ArtistPhoto from './ArtistPhoto'
import {ArtistDocument} from '~/types/artist'
import {Link} from 'lucide-react'
import AlbumCover from '~/components/RecordCover'
import SubTitle from './SubTitle'

export default function Artist(props: ArtistDocument) {
  const {_id, title, content, image, records} = props

  return (
    <Layout>
      <article className="flex flex-col items-start gap-4 lg:flex-row lg:gap-12">
        <div className="grid-gap-4 mx-auto grid max-w-[70vw] grid-cols-1">
          <ArtistPhoto image={image} title={title} /> 
        </div>
        <div className="flex flex-shrink-0 flex-col gap-4 md:gap-6 lg:w-2/3">
          <header>
            <SubTitle>Artist</SubTitle>

            {title ? <Title>{title}</Title> : null}
          </header>
          {content && content?.length > 0 ? <SanityContent value={content} /> : null}
        </div>
      </article>

      {records.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Records</h2>

          <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-12 lg:grid-cols-4">
            {records.map((record) => (
              <li key={record._id} className="group relative flex flex-col">
                <div className="relative overflow-hidden transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:opacity-90">
                  <div className="absolute z-0 h-48 w-[200%] translate-x-20 translate-y-20 -rotate-45 bg-gradient-to-b from-white to-transparent opacity-25 mix-blend-overlay transition-transform duration-500 ease-in-out group-hover:translate-y-10 group-hover:translate-x-10 group-hover:opacity-75" />
                  <AlbumCover image={record.image} title={record.title} />
                </div>
                <div className="flex flex-col">
                  {record?.slug ? (
                    <Link
                      to={record?.slug}
                      className="text-bold pt-4 text-xl font-bold tracking-tighter transition-colors duration-100 ease-in-out hover:bg-cyan-400 hover:text-white md:text-3xl"
                    >
                      {record.title}
                      {/* Makes this entire block clickable */}
                      <span className="absolute inset-0" />
                    </Link>
                  ) : (
                    <span className="pt-4 text-xl font-bold">{record.title}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        ) : (
          <p>No records found</p>
        )
      }
    </Layout>
  )
}

type PreviewArtistProps = {
  query: string
  params: {[key: string]: string}
  token: string | null
}

const {projectId, dataset} = projectDetails()
const usePreview = definePreview({projectId, dataset})

export function PreviewArtist(props: PreviewArtistProps) {
  const {query, params, token} = props

  const data = usePreview(token ?? null, query, params)

  return (
    <>
      <ExitPreview />
      <Artist {...data} />
    </>
  )
}
