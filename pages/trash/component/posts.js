/* eslint-disable react-hooks/rules-of-hooks */
import { IMAGE_FALLBACK } from '@/constants'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  ExclamationCircleOutlined,
  ReloadOutlined,
  RollbackOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Image,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'

const { confirm } = Modal
const { Paragraph } = Typography

const Posts = () => {
  const { data, isLoading, fetchingData, useMutate } =
    useQueriesMutation({
      prefixUrl: '/posts/archived',
    })

  const showConfirmRollback = (params) => {
    confirm({
      title: 'Restore Confirm',
      content: <p>Are you sure to restore this data ?</p>,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const response = await useMutate({
          prefixUrl: `/post/restore/${params?.id}`,
        })
        if (response?.success) {
          fetchingData({ prefixUrl: '/posts/archived' })
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'Thumbnails',
      render: ({ thumbnail }) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_PATH_IMAGE}/${thumbnail}`}
          alt={thumbnail}
          fallback={IMAGE_FALLBACK}
        />
      ),
    },
    {
      title: 'Title',
      render: ({ title }) => <Paragraph>{title}</Paragraph>,
    },
    {
      title: 'Slug',
      render: ({ slug }) => <Paragraph>{slug}</Paragraph>,
    },
    {
      title: 'Category',
      render: ({ categories }) => (
        <Tag color="purple" icon={<TagsOutlined />}>
          {categories?.title}
        </Tag>
      ),
    },
    {
      title: 'Posted By',
      render: ({ user }) => (
        <Space direction="vertical">
          <span>{user?.name}</span>
          <span>{user?.email}</span>
        </Space>
      ),
    },
    {
      title: 'Deleted At',
      key: 'deleted_at',
      dataIndex: 'deleted_at',
      render: (deleted_at) =>
        deleted_at ? dayjs(deleted_at).format('DD MMMM YYYY') : '-',
    },
    {
      title: 'Aksi',
      render: (item) => (
        <Space>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => showConfirmRollback(item)}
          >
            Restore Data
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="Posts"
      bordered={false}
      extra={[
        <Space key="action-posts-trash">
          <Button
            icon={<ReloadOutlined />}
            onClick={() =>
              fetchingData({
                prefixUrl: '/posts/archived',
              })
            }
          >
            Reload Data
          </Button>
        </Space>,
      ]}
    >
      <Table
        rowKey="key"
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        style={{ width: '100%' }}
        scroll={{ x: 1300 }}
        size="small"
        pagination={{
          total: data?.pagination?.total,
          current: data?.pagination?.currentPage,
          pageSize: data?.pagination?.perPage,
          showQuickJumper: false,
          hideOnSinglePage: true,
          showTotal: (total) => `${total} Data`,
          onChange: (page) =>
            fetchingData({
              prefixUrl: `/posts/archived?page=${page}`,
            }),
        }}
      />
    </Card>
  )
}

export default Posts
