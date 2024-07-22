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
import { Card, Col, Row, Statistic, Typography } from 'antd'
import dynamic from 'next/dynamic'
import { useContext } from 'react'

const BarReactChart = dynamic(
  () => import('@/components/bar-react-chart'),
  { ssr: false },
)

export default function Home() {
  const profileUser = useContext(ProfileContext)

  const sizeWidth = {
    col: ['superadmin'].includes(profileUser?.type) ? 12 : 6,
    barWidth: ['superadmin'].includes(profileUser?.type) ? 750 : 300,
  }

  const { data: grafikCounts, isLoading } = useQueriesMutation({
    prefixUrl: '/grafik/counts',
  })

  const { data: grafikPosts, isLoading: isLoadingPost } =
    useQueriesMutation({
      prefixUrl: '/grafik/posts',
    })

  const { data: grafikUnit, isLoading: isLoadingUnit } =
    useQueriesMutation({
      prefixUrl: '/grafik/unit',
    })

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
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Total News"
              value={grafikCounts?.data?.post_count}
              prefix={<FileTextOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Total Media Post"
              value={grafikCounts?.data?.media_count}
              prefix={<FileImageOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Total Category News"
              value={grafikCounts?.data?.category_news_count}
              prefix={<TagsOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={4}>
          <RoleComponentRender
            condition={['superadmin'].includes(profileUser?.type)}
          >
            <Card bordered={false}>
              <Statistic
                title="Total User"
                value={grafikCounts?.data?.user_count}
                prefix={<UsergroupAddOutlined />}
                loading={isLoading}
              />
            </Card>
          </RoleComponentRender>
        </Col>

        <Col span={4}>
          <RoleComponentRender
            condition={['superadmin'].includes(profileUser?.type)}
          >
            <Card bordered={false}>
              <Statistic
                title="Total Unit"
                value={grafikCounts?.data?.unit_count}
                prefix={<AimOutlined />}
                loading={isLoading}
              />
            </Card>
          </RoleComponentRender>
        </Col>
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
          <Card
            title="Grafik user unit with type"
            bordered={false}
            loading={isLoadingUnit}
          >
            <BarReactChart
              width={sizeWidth?.barWidth}
              data={grafikUnit?.data}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
