/* eslint-disable react-hooks/rules-of-hooks */
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Card, Modal, Space, Table } from 'antd'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const Add = dynamic(() => import('../drawer/add'))
const Edit = dynamic(() => import('../drawer/edit'))

const UnitDetail = ({ isMobile }) => {
  const { data, isLoading, fetchingData, useMutate } =
    useQueriesMutation({
      prefixUrl: '/units',
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
          prefixUrl: `/category/${params?.id}`,
          method: 'DELETE',
        })
        if (response?.success) {
          fetchingData({ prefixUrl: '/categories' })
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Aksi',
      render: (item) => (
        <Space direction="horizontal">
          <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => setOpenEdit(item?.id)}
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
    <Space key="action-list-unit">
      <Button
        icon={<ReloadOutlined />}
        onClick={() => fetchingData({ prefixUrl: '/categories' })}
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
    <Card title="Unit" bordered={false} extra={extraDesktop}>
      <Table
        rowKey="list-unit"
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        style={{ width: '100%' }}
        scroll={{ x: 425 }}
        size="small"
        pagination={{
          total: data?.pagination?.total,
          current: data?.pagination?.currentPage,
          pageSize: data?.pagination?.perPage,
          showQuickJumper: false,
          hideOnSinglePage: true,
          showTotal: (total) => `${total} Data`,
          onChange: (page) =>
            fetchingData({ prefixUrl: `/units?page=${page}` }),
        }}
      />
      {isOpenAdd && (
        <Add
          isMobile={isMobile}
          isOpenAdd={isOpenAdd}
          onClose={() => {
            setOpenAdd(false)
            Modal.destroyAll()
            fetchingData({ prefixUrl: '/units' })
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
            fetchingData({ prefixUrl: '/units' })
          }}
        />
      )}
    </Card>
  )
}

export default UnitDetail
