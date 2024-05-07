/* eslint-disable react-hooks/rules-of-hooks */
import { IMAGE_FALLBACK } from '@/constants'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
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
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const { Paragraph } = Typography

const Pegawai = ({ isMobile }) => {
  const { data, isLoading, fetchingData, useMutate } =
    useQueriesMutation({
      prefixUrl: '/posts',
    })
  const [isOpenAdd, setOpenAdd] = useState(false)
  const [isOpenEdit, setOpenEdit] = useState(false)
  const router = useRouter()

  const showConfirmDelete = (params) => {
    Modal.confirm({
      title: 'Delete Confirm',
      content: <p>Are you sure ?</p>,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const response = await useMutate({
          prefixUrl: `/post/${params?.id}`,
          method: 'DELETE',
        })
        if (response?.success) {
          fetchingData({ prefixUrl: '/posts' })
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
      render: ({ title }) => (
        <Paragraph ellipsis={{ rows: 5 }}>{title}</Paragraph>
      ),
    },
    {
      title: 'Slug',
      render: ({ slug }) => (
        <Paragraph ellipsis={{ rows: 4 }}>{slug}</Paragraph>
      ),
    },
    {
      title: 'Description',
      render: ({ description }) => (
        <Paragraph ellipsis={{ rows: 4 }}>{description}</Paragraph>
      ),
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
      title: 'Posted',
      key: 'posted',
      dataIndex: 'posted',
      render: (posted) => (
        <Tag
          color={posted ? 'green' : 'magenta'}
          icon={
            posted ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
        >
          {posted ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Banner',
      key: 'banner',
      dataIndex: 'banner',
      render: (banner) => (
        <Tag
          color={banner ? 'green' : 'magenta'}
          icon={
            banner ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
        >
          {banner ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (created_at) =>
        created_at
          ? dayjs(created_at).locale('id').format('DD MMMM YYYY')
          : '-',
    },
    {
      title: 'Aksi',
      fixed: 'right',
      render: (item) => (
        <Space direction="vertical">
          <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => setOpenEdit(item?.id)}
            size="small"
          >
            Edit
          </Button>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => showConfirmDelete(item)}
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const extraDesktop = [
    <Space key="descktop-action-pegawai">
      <Button
        icon={<ReloadOutlined />}
        onClick={() => fetchingData({ prefixUrl: '/posts' })}
      >
        Reload Data
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpenAdd(true)}
      >
        Add Post
      </Button>
    </Space>,
  ]

  return (
    <Card title="Posts" bordered={false} extra={extraDesktop}>
      <Table
        rowKey="key"
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        style={{ width: '100%' }}
        scroll={{ x: 1300 }}
        pagination={{
          total: data?.pagination?.total,
          current: data?.pagination?.currentPage,
          pageSize: data?.pagination?.perPage,
          showQuickJumper: false,
          hideOnSinglePage: true,
          showTotal: (total) => `${total} Data`,
          onChange: (page) =>
            fetchingData({ prefixUrl: `/posts?page=${page}` }),
        }}
        size="small"
      />
      {isOpenAdd && (
        <Add
          isMobile={isMobile}
          isOpenAdd={isOpenAdd}
          onClose={() => {
            setOpenAdd(false)
            Modal.destroyAll()
            fetchingData({ prefixUrl: '/posts' })
          }}
        />
      )}
      {isOpenEdit && (
        <Edit
          isMobile={isMobile}
          isOpen={isOpenEdit}
          onClose={() => {
            setOpenEdit(false)
            Modal.destroyAll()
            fetchingData({ prefixUrl: '/posts' })
          }}
        />
      )}
    </Card>
  )
}

export default Pegawai
