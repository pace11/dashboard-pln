/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { ProfileContext } from '@/context/profileContextProvider'
import { formatDate, labelStatus, roleUser } from '@/helpers/utils'
import LayoutIndicators from '@/layout/indicators'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LinkOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Card, Modal, Space, Table, Typography } from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const { Paragraph, Text } = Typography

const Media = ({ isMobile }) => {
  const profileUser = useContext(ProfileContext)
  const { data, isLoading, fetchingData, useMutate } =
    useQueriesMutation({
      prefixUrl: '/media',
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
          prefixUrl: `/media/${params?.id}`,
          method: 'DELETE',
        })
        if (response?.success) {
          fetchingData({ prefixUrl: '/media' })
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'Title',
      render: ({ title }) => <Paragraph>{title}</Paragraph>,
    },
    {
      title: 'Url',
      width: 300,
      render: ({ url }) => (
        <Space direction="vertical">
          <Paragraph>{url}</Paragraph>
          <Button
            icon={<LinkOutlined />}
            type="dashed"
            onClick={() => window.open(url, '_blank')}
            size="small"
          >
            Open Url
          </Button>
        </Space>
      ),
    },
    {
      title: 'Caption',
      render: ({ caption }) => (
        <Paragraph ellipsis={{ rows: 3 }}>{caption}</Paragraph>
      ),
    },
    {
      title: 'Target Post',
      render: ({ target_post }) => <Text>{target_post}</Text>,
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
              hidden={['rejected', 'final_rejected'].includes(item?.status)}
            >
              Edit
            </Button>
          </RoleComponentRender>
          <Button
            type="dashed"
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(`/indicators/media/${item?.id}`)
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
              hidden={['rejected', 'final_rejected'].includes(item?.status)}
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
        onClick={() => fetchingData({ prefixUrl: '/media' })}
      >
        Reload Data
      </Button>
      <RoleComponentRender
        condition={['creator', 'superadmin'].includes(
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
          Add Media
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
              fetchingData({ prefixUrl: `/media?page=${page}` }),
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
              fetchingData({ prefixUrl: '/media' })
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
              fetchingData({ prefixUrl: `/media` })
            }}
          />
        )}
      </Card>
    </LayoutIndicators>
  )
}

export default Media
