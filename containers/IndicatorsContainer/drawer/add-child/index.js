import dynamic from 'next/dynamic'

const Berita = dynamic(() => import('./berita'))
const Media = dynamic(() => import('./media'))
const Scoring = dynamic(() => import('./scoring'))
const InformasiPublic = dynamic(() => import('./informasi-public'))
const Default = dynamic(() => import('./default'))

const templates = {
  berita: Berita,
  media: Media,
  scoring: Scoring,
  'pengelolaan-informasi-public': InformasiPublic,
}

const AddChild = (props) => {
  const slug = props?.slug
  const RenderComponent = templates?.[slug] ?? Default

  if (RenderComponent) return <RenderComponent {...props} />
}

export default AddChild
