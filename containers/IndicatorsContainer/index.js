import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const News = dynamic(() => import('./content/news'))
const Media = dynamic(() => import('./content/media'))
const Influencer = dynamic(() =>
  import('./content/pengelolaan-akun-influencer'),
)
const KomunikasiInternal = dynamic(() =>
  import('./content/pengelolaan-komunikasi-internal'),
)
const Scoring = dynamic(() => import('./content/scoring'))
const InformasiPublic = dynamic(() =>
  import('./content/pengelolaan-informasi-public'),
)

const templates = {
  news: News,
  media: Media,
  'pengelolaan-akun-influencer': Influencer,
  'pengelolaan-komunikasi-internal': KomunikasiInternal,
  scoring: Scoring,
  'pengelolaan-informasi-public': InformasiPublic,
}

const IndicatorsContainer = () => {
  const router = useRouter()
  const { slug } = router?.query
  const RenderComponent = templates?.[slug ?? 'news'] ?? null

  if (RenderComponent) return <RenderComponent />
}

export default IndicatorsContainer
