/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { IMAGE_FALLBACK } from '@/constants'
import { ProfileContext } from '@/context/profileContextProvider'
import { formatDate, labelStatus, labelYesNo, roleUser } from '@/helpers/utils'
import LayoutIndicators from '@/layout/indicators'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
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
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const { Paragraph, Text } = Typography

const News = ({ isMobile }) => {
  const profileUser = useContext(ProfileContext)
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
      title: 'Category',
      render: ({ categories }) => (
        <Tag color="purple" icon={<TagsOutlined />}>
          {categories?.title}
        </Tag>
      ),
    },
    {
      title: 'Posted',
      key: 'posted',
      dataIndex: 'posted',
      render: (posted) => labelYesNo(posted),
    },
    {
      title: 'Banner',
      key: 'banner',
      dataIndex: 'banner',
      render: (banner) => labelYesNo(banner),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => labelStatus(status)?.tag,
    },
    {
      title: 'Created By',
      render: ({ user }) => (
        <Space>
          <Text>{user?.email}</Text>
        </Space>
      ),
    },
    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (created_at) => formatDate(created_at),
    },
    {
      title: 'Aksi',
      fixed: 'right',
      render: (item) => (
        <Space direction="vertical">
          <RoleComponentRender
            condition={
              !!item?.is_own_post ||
              !!item?.is_superadmin ||
              !!item?.is_checker ||
              !!item?.is_approver
            }
          >
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => setOpenEdit(item)}
            >
              Edit
            </Button>
          </RoleComponentRender>
          <Button
            type="dashed"
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(`/indicators/news/${item?.id}`)
            }
          >
            Detail
          </Button>
          <RoleComponentRender
            condition={
              !!item?.is_own_post ||
              !!item?.is_superadmin ||
              !!item?.is_checker ||
              !!item?.is_approver
            }
          >
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => showConfirmDelete(item)}
            >
              Delete
            </Button>
          </RoleComponentRender>
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
      <RoleComponentRender
        condition={['creator', 'superadmin', 'admin'].includes(
          roleUser({ user: profileUser }),
        )}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpenAdd(true)
          }}
        >
          Add Post
        </Button>
      </RoleComponentRender>
    </Space>,
  ]

  return (
    <LayoutIndicators>
      <Card bordered={false} extra={extraDesktop}>
        <Table
          rowKey="key"
          dataSource={data?.data}
          columns={columns}
          loading={isLoading}
          style={{ width: '100%' }}
          scroll={{ x: 1300, y: '50vh' }}
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
              fetchingData({ prefixUrl: `/posts` })
            }}
          />
        )}
      </Card>
    </LayoutIndicators>
  )
}

export default News
