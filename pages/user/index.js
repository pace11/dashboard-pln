/* eslint-disable react-hooks/rules-of-hooks */
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Card, Modal, Space, Table, Tag } from 'antd'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const User = ({ isMobile }) => {
  const { data, isLoading, fetchingData, useMutate } =
    useQueriesMutation({
      prefixUrl: '/users',
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
          prefixUrl: `/user/${params?.id}`,
          method: 'DELETE',
        })
        if (response?.success) {
          fetchingData({ prefixUrl: '/users' })
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Password',
      key: 'password',
      render: () => <Tag icon={<LockOutlined />}>*****</Tag>,
    },
    {
      title: 'Type',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: 'Placement',
      render: (item) =>
        item?.placement === 'main_office'
          ? 'Kantor Induk'
          : 'Unit Pelaksana',
    },
    {
      title: 'Unit',
      render: (item) => item?.unit?.title || '',
    },
    {
      title: 'Aksi',
      render: (item) => (
        <Space direction="horizontal">
          <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => setOpenEdit(item)}
          >
            Edit
          </Button>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => showConfirmDelete(item)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const extraDesktop = [
    <Space key="action-list-user">
      <Button
        icon={<ReloadOutlined />}
        onClick={() => fetchingData({ prefixUrl: '/users' })}
      >
        Reload Data
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpenAdd(true)}
      >
        Add Data
      </Button>
    </Space>,
  ]

  return (
    <Card title="User" bordered={false} extra={extraDesktop}>
      <Table
        rowKey="list-user"
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        style={{ width: '100%' }}
        scroll={{ y: '50vh' }}
        size="small"
        pagination={{
          total: data?.pagination?.total,
          current: data?.pagination?.currentPage,
          pageSize: data?.pagination?.perPage,
          showQuickJumper: false,
          hideOnSinglePage: true,
          showTotal: (total) => `${total} Data`,
          onChange: (page) =>
            fetchingData({ prefixUrl: `/users?page=${page}` }),
        }}
      />
      {isOpenAdd && (
        <Add
          isMobile={isMobile}
          isOpenAdd={isOpenAdd}
          onClose={() => {
            setOpenAdd(false)
            Modal.destroyAll()
            fetchingData({ prefixUrl: '/users' })
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
            fetchingData({ prefixUrl: '/users' })
          }}
        />
      )}
    </Card>
  )
}

export default User
