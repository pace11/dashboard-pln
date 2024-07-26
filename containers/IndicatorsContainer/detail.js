import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const News = dynamic(() => import('./content/news/detail'))
const Media = dynamic(() => import('./content/media/detail'))
const AccountInfluencer = dynamic(() =>
  import('./content/pengelolaan-akun-influencer/detail'),
)
const InternalComm = dynamic(() =>
  import('./content/pengelolaan-komunikasi-internal/detail'),
)
const Scoring = dynamic(() => import('./content/scoring/detail'))
const InformasiPublic = dynamic(() =>
  import('./content/pengelolaan-informasi-public/detail'),
)

const templates = {
  news: News,
  media: Media,
  'pengelolaan-akun-influencer': AccountInfluencer,
  'pengelolaan-komunikasi-internal': InternalComm,
  scoring: Scoring,
  'pengelolaan-informasi-public': InformasiPublic,
}

const IndicatorsContainerDetail = () => {
  const router = useRouter()
  const { slug } = router?.query
  const RenderComponent = templates?.[slug ?? 'news'] ?? null

  if (RenderComponent) return <RenderComponent />
}

export default IndicatorsContainerDetail
