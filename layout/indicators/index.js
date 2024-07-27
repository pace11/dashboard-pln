import { Card, Tabs } from 'antd'
import { useRouter } from 'next/router'

const items = ({ children }) => [
  {
    key: 'berita',
    label: '1. Release Berita',
    children: children,
  },
  {
    key: 'media',
    label: '2. Photo/Video Media',
    children: children,
  },
  {
    key: 'pengelolaan-akun-influencer',
    label: '3. Pengelolaan akun influencer',
    children: children,
  },
  {
    key: 'pengelolaan-komunikasi-internal',
    label: '4. Pengelolaan komunikasi internal',
    children: children,
  },
  {
    key: 'scoring',
    label: '5. Scoring',
    children: children,
  },
  {
    key: 'pengelolaan-informasi-public',
    label: '6. Pengelolaan Informasi Public',
    children: children,
  },
]

const LayoutIndicators = ({ children }) => {
  const router = useRouter()
  const { slug } = router?.query

  return (
    <Card>
      <Tabs
        activeKey={slug || 'berita'}
        items={items({ children })}
        onTabClick={(key) => {
          router.push(`/indicators/${key}`)
        }}
      />
    </Card>
  )
}

export default LayoutIndicators
