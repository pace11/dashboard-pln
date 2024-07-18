import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const News = dynamic(() => import('./content/news/detail'))
const Media = dynamic(() => import('./content/media/detail'))

const templates = {
  news: News,
  media: Media,
}

const IndicatorsContainerDetail = () => {
  const router = useRouter()
  const { slug } = router?.query
  const RenderComponent = templates?.[slug ?? 'news'] ?? null

  if (RenderComponent) return <RenderComponent />
}

export default IndicatorsContainerDetail
