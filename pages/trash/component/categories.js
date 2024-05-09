/* eslint-disable react-hooks/rules-of-hooks */
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  ExclamationCircleOutlined,
  ReloadOutlined,
  RollbackOutlined,
} from '@ant-design/icons'
import { Button, Card, Modal, Space, Table } from 'antd'
import dayjs from 'dayjs'

const { confirm } = Modal

const Categories = () => {
  const { data, isLoading, fetchingData, useMutate } =
    useQueriesMutation({
      prefixUrl: '/categories/archived',
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
          prefixUrl: `/category/restore/${params?.id}`,
        })
        if (response?.success) {
          fetchingData({ prefixUrl: '/categories/archived' })
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Slug',
      key: 'slug',
      dataIndex: 'slug',
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
      title="Categories"
      bordered={false}
      extra={[
        <Space key="action-categories-trash">
          <Button
            icon={<ReloadOutlined />}
            onClick={() =>
              fetchingData({
                prefixUrl: `/categories/archived`,
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
              prefixUrl: `/categories/archived?page=${page}`,
            }),
        }}
      />
    </Card>
  )
}

export default Categories
