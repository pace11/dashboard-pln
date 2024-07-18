/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { ProfileContext } from '@/context/profileContextProvider'
import { formatDate, labelYesNo, roleUser } from '@/helpers/utils'
import LayoutIndicators from '@/layout/indicators'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Card, Modal, Space, Table, Typography } from 'antd'
import dynamic from 'next/dynamic'
import { useContext, useState } from 'react'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const { Paragraph, Text } = Typography

const PengelolaInformasiPublic = ({ isMobile }) => {
  const profileUser = useContext(ProfileContext)
  const url = ['superadmin'].includes(roleUser({ user: profileUser }))
    ? '/link/key/indicator-6'
    : '/link/key/indicator-6/active'
  const { data, isLoading, fetchingData, useMutate } =
    useQueriesMutation({
      prefixUrl: url,
    })
  const [isOpenAdd, setOpenAdd] = useState(false)
  const [isOpenEdit, setOpenEdit] = useState(false)

  const showConfirmDelete = (params) => {
    Modal.confirm({
      title: 'Delete Confirm',
      content: <p>Are you sure ?</p>,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const response = await useMutate({
          prefixUrl: `/link/${params?.id}`,
          method: 'DELETE',
        })
        if (response?.success) {
          fetchingData({ prefixUrl: url })
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
      render: ({ url }) => (
        <Space>
          <Paragraph>{url}</Paragraph>
          <Button
            icon={<LinkOutlined />}
            type="dashed"
            onClick={() => window.open(url, '_blank')}
          >
            Open Url
          </Button>
        </Space>
      ),
    },
    {
      title: 'Periode',
      render: ({ period }) => <Text>{period}</Text>,
    },
    {
      title: 'Active',
      render: ({ active }) => labelYesNo(active),
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
          <RoleComponentRender condition={!!item?.is_superadmin}>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => setOpenEdit(item)}
            >
              Edit
            </Button>
          </RoleComponentRender>
          <RoleComponentRender condition={!!item?.is_superadmin}>
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
        onClick={() => fetchingData({ prefixUrl: url })}
      >
        Reload Data
      </Button>
      <RoleComponentRender
        condition={['superadmin'].includes(
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
          Add Link
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
              fetchingData({
                prefixUrl: `${url}?page=${page}`,
              }),
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
              fetchingData({ prefixUrl: url })
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
              fetchingData({ prefixUrl: url })
            }}
          />
        )}
      </Card>
    </LayoutIndicators>
  )
}

export default PengelolaInformasiPublic
