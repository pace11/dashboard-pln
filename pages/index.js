import RoleComponentRender from '@/components/role-component-render'
import { ProfileContext } from '@/context/profileContextProvider'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  AimOutlined,
  FileImageOutlined,
  FileTextOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { Card, Col, Row, Statistic, Table, Typography } from 'antd'
import dynamic from 'next/dynamic'
import { useContext } from 'react'

const BarReactChart = dynamic(
  () => import('@/components/bar-react-chart'),
  { ssr: false },
)

export default function Home() {
  const profileUser = useContext(ProfileContext)

  const sizeWidth = {
    col: 12,
    barWidth: 500,
  }

  const { data: grafikCounts, isLoading } = useQueriesMutation({
    prefixUrl: '/grafik/counts',
  })

  const { data: grafikPosts, isLoading: isLoadingPost } =
    useQueriesMutation({
      prefixUrl: '/grafik/posts',
    })

  const { data: grafikIndicators, isLoading: isLoadingIndicators } =
    useQueriesMutation({
      prefixUrl: '/grafik/unit/indicators',
    })

  const columns = [
    {
      title: 'Unit',
      key: 'unit_name',
      dataIndex: 'unit_name',
    },
    {
      title: 'Indicator 1',
      key: 'indicator_1',
      dataIndex: 'indicator_1',
      render: (indicator_1) =>
        indicator_1 ? `${indicator_1}%` : '0',
    },
    {
      title: 'Indicator 2',
      key: 'indicator_2',
      dataIndex: 'indicator_2',
      render: (indicator_2) =>
        indicator_2 ? `${indicator_2}%` : '0',
    },
    {
      title: 'Indicator 3',
      key: 'indicator_3',
      dataIndex: 'indicator_3',
      render: (indicator_3) =>
        indicator_3 ? `${indicator_3}%` : '0',
    },
    {
      title: 'Indicator 4',
      key: 'indicator_4',
      dataIndex: 'indicator_4',
      render: (indicator_4) =>
        indicator_4 ? `${indicator_4}%` : '0',
    },
    {
      title: 'Indicator 5',
      key: 'indicator_5',
      dataIndex: 'indicator_5',
      render: (indicator_5) =>
        indicator_5 ? `${indicator_5}%` : '0',
    },
    {
      title: 'Indicator 6',
      key: 'indicator_6',
      dataIndex: 'indicator_6',
      render: (indicator_6) =>
        indicator_6 ? `${indicator_6}%` : '0',
    },
    {
      title: 'Target',
      key: 'target',
      dataIndex: 'target',
      render: (target) => (target ? `${target}%` : '0'),
    },
    {
      title: 'Realization',
      key: 'realization',
      dataIndex: 'realization',
      render: (realization) =>
        realization ? `${realization}%` : '0',
    },
  ]

  return (
    <>
      <Row gutter={[14, 14]}>
        <Col
          span={24}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {profileUser?.type !== 'superadmin' && (
            <Typography.Title level={3}>
              <AimOutlined />
              {`${
                profileUser?.placement === 'main_office'
                  ? ' Kantor Induk'
                  : ` Unit: ${profileUser?.unit_id?.title}`
              }`}
            </Typography.Title>
          )}
        </Col>
      </Row>
      <Row gutter={[14, 14]}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total News"
              value={grafikCounts?.data?.post_count}
              prefix={<FileTextOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Media Post"
              value={grafikCounts?.data?.media_count}
              prefix={<FileImageOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Category News"
              value={grafikCounts?.data?.category_news_count}
              prefix={<TagsOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <RoleComponentRender
          condition={['superadmin'].includes(profileUser?.type)}
        >
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Total User"
                value={grafikCounts?.data?.user_count}
                prefix={<UsergroupAddOutlined />}
                loading={isLoading}
              />
            </Card>
          </Col>
        </RoleComponentRender>
        <RoleComponentRender
          condition={['superadmin'].includes(profileUser?.type)}
        >
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Total Unit"
                value={grafikCounts?.data?.unit_count}
                prefix={<AimOutlined />}
                loading={isLoading}
              />
            </Card>
          </Col>
        </RoleComponentRender>
      </Row>
      <Row gutter={[14]} style={{ marginTop: '14px' }}>
        <Col span={sizeWidth?.col}>
          <Card
            title="Grafik news unit with status"
            bordered={false}
            loading={isLoadingPost}
          >
            <BarReactChart
              width={sizeWidth?.barWidth}
              data={grafikPosts?.data}
            />
          </Card>
        </Col>
        <Col span={sizeWidth?.col}>
          <Card title="Data indicator by unit" bordered={false}>
            <Table
              rowKey="grafik-indicator"
              columns={columns}
              dataSource={grafikIndicators?.data}
              loading={isLoadingIndicators}
              scroll={{ x: 1000 }}
              style={{ width: '100%' }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
