import { Card, Button, Table, Space, Modal, notification } from 'antd'
import {
  ReloadOutlined,
  ExclamationCircleOutlined,
  RollbackOutlined,
} from '@ant-design/icons'
import { HookSwr } from '@/lib/hooks/HookSwr'
import { restoreApi } from '@/helpers/utils'
import dayjs from 'dayjs'

const { confirm } = Modal

const Agama = () => {
  const { data, isLoading, reloadData } = HookSwr({
    path: '/agama',
    query: '?status=archived',
  })

  const showConfirmRollback = (params) => {
    confirm({
      title: 'Kembalikan data',
      content: (
        <p>
          yakin untuk mengembalikan data ini `<b>{params.title}</b>` ?
        </p>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya, Kembalikan',
      cancelText: 'Tidak',
      onOk: () => {
        restoreApi({
          endpoint: `/agama/restore/${params.id}`,
        })
          .then((res) => {
            reloadData('?status=archived')
            notification.success({
              message: 'Info',
              description: res?.data?.message,
              duration: 1,
            })
          })
          .catch((err) => {
            if ([400].includes(err?.response?.status)) {
              notification.warning({
                message: err?.response?.data?.message,
                description: JSON.stringify(
                  err?.response?.data?.data,
                ),
                duration: 1,
              })
            }
            if ([500].includes(err?.response?.status)) {
              notification.error({
                message: 'Error',
                description: err?.response?.statusText,
                duration: 1,
              })
            }
          })
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
      title: 'Tanggal Dihapus',
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
            Kembalikan Data
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="Agama"
      bordered={false}
      extra={[
        <Space key="action-agama-trash">
          <Button
            icon={<ReloadOutlined />}
            onClick={() => reloadData('?status=archived')}
          >
            Refresh data
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
      />
    </Card>
  )
}

export default Agama
