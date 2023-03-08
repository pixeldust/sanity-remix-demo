import type {LinksFunction, LoaderArgs, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import groq from 'groq'
import {PreviewSuspense} from '@sanity/preview-kit'

import stylesheet from '~/tailwind.css'
import Artist, {PreviewArtist} from '~/components/Artist'
import {getClient} from '~/sanity/client'
import {artistZ} from '~/types/artist'
import {getSession} from '~/sessions'
import type {HomeDocument} from '~/types/home'
// import {OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT} from '~/routes/resource/og'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: stylesheet}]
}

export const meta: MetaFunction = ({data, parentsData}) => {
  const home = parentsData.root.home as HomeDocument

  const title = [data.title, home.siteTitle].filter(Boolean).join(' | ')
  // const {ogImageUrl} = data

  return {
    title,
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'og:title': title,
    // 'og:image:width': String(OG_IMAGE_WIDTH),
    // 'og:image:height': String(OG_IMAGE_HEIGHT),
    // 'og:image': ogImageUrl,
  }
}


// Load the `artist` document with this slug
export const loader = async ({params, request}: LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const token = session.get('token')
  const preview = Boolean(token)

  const query = groq`*[_type == "artist" && slug.current == $slug][0]{
    _id,
    title,
    // GROQ can re-shape data in the request!
    "slug": slug.current,
    "artist": artist->title,
    image,
    content,
    summary,
    "records": *[_type == "record" && references(^._id)]{
      _id,
      title,
      "slug": slug.current,
      artist -> {
        title,
        "slug": slug.current,
      },
      image
    },
  }`

  const artist = await getClient(preview)
    // Params from the loader uses the filename
    // $slug.tsx has the params { slug: 'hello-world' }
    .fetch(query, params)
    // Parsed with Zod to validate data at runtime
    // and generate a Typescript type
    .then((res) => (res ? artistZ.parse(res) : null))

  if (!artist) {
    throw new Response('Not found', {status: 404})
  }

  // Create social share image url
  const {origin} = new URL(request.url)
  // const ogImageUrl = `${origin}/resource/og?id=${artist._id}`

  return json({
    artist,
    // ogImageUrl,
    preview,
    query: preview ? query : null,
    params: preview ? params : null,
    // Note: This makes the token available to the client if they have an active session
    // This is useful to show live preview to unauthenticated users
    // If you would rather not, replace token with `null` and it will rely on your Studio auth
    token: preview ? token : null,
  })
}

export default function ArtistPage() {
  const {artist, preview, query, params, token} = useLoaderData<typeof loader>()

  if (preview && query && params && token) {
    return (
      <PreviewSuspense fallback={<Artist {...artist} />}>
        <PreviewArtist query={query} params={params} token={token} />
      </PreviewSuspense>
    )
  }

  return <Artist {...artist} />
}
