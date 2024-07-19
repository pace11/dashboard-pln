import RoleComponentRender from '@/components/role-component-render'
import { ProfileContext } from '@/context/profileContextProvider'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  AimOutlined,
  FileTextOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Badge,
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Typography,
} from 'antd'
import { useContext } from 'react'

export default function Home() {
  const profileUser = useContext(ProfileContext)
  const { data: grafik, isLoading } = useQueriesMutation({
    prefixUrl: '/grafik',
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
        <Col span={6}>
          <Card bordered={false}>
            <Row>
              <Col span={6}>
                <Statistic
                  title="Total Post"
                  value={grafik?.data?.post_count?.total_posts}
                  prefix={<FileTextOutlined />}
                  loading={isLoading}
                />
              </Col>
              <Col span={12}>
                <Space direction="vertical">
                  <Badge
                    status="processing"
                    text={`${grafik?.data?.post_count?.created_posts} Posts Created`}
                  />
                  <Badge
                    status="warning"
                    text={`${grafik?.data?.post_count?.checked_posts} Posts Checked`}
                  />
                  <Badge
                    status="success"
                    text={`${grafik?.data?.post_count?.approved_posts} Posts Approved`}
                  />
                  <Badge
                    status="error"
                    text={`${grafik?.data?.post_count?.rejected_posts} Posts Rejected`}
                  />
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Category"
              value={grafik?.data?.category_count}
              prefix={<TagsOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <RoleComponentRender
          condition={['admin', 'superadmin'].includes(
            profileUser?.type,
          )}
        >
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Total User"
                value={grafik?.data?.user_count}
                prefix={<UserOutlined />}
                loading={isLoading}
              />
            </Card>
          </Col>
        </RoleComponentRender>
      </Row>
    </>
  )
}
