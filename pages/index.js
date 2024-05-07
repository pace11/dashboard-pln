import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import { FileTextOutlined, TagsOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'

export default function Home() {
  const { data: grafik, isLoading } = useQueriesMutation({
    prefixUrl: '/grafik',
  })
  const countPost = grafik?.data?.post_count ?? 0
  const countCategory = grafik?.data?.category_count ?? 0

  return (
    <>
      <Row gutter={[14, 14]} style={{ marginBottom: '15px' }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Post"
              value={countPost}
              prefix={<FileTextOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Category"
              value={countCategory}
              prefix={<TagsOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
