import { labelStatus } from '@/helpers/utils'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import { Button, Card, List, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'next/router'

dayjs.extend(relativeTime)

export default function Notifications() {
  const router = useRouter()
  const { data, isLoading } = useQueriesMutation({
    prefixUrl: '/notifications',
  })

  return (
    <Card title="Notifications" bordered={false}>
      <List
        bordered
        loading={isLoading}
        dataSource={data?.data || []}
        renderItem={(item) => (
          <List.Item>
            <Space>
              <Typography.Text strong>{`${
                item?.is_own_notification ? 'Your' : item?.user?.email
              }`}</Typography.Text>
              <Typography.Text>post</Typography.Text>
              <Typography.Text>
                {labelStatus(item?.status)?.tag}
              </Typography.Text>
              <Typography.Text type="secondary" italic>
                {`"${dayjs().to(
                  dayjs(new Date(item?.created_at), true),
                )}"`}
              </Typography.Text>
              <Button
                size="small"
                onClick={() =>
                  router.push(`/posts/${item?.posts_id}`)
                }
              >
                See Details
              </Button>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  )
}
