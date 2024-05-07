import { restoreApi } from '@/helpers/utils'
import { HookSwr } from '@/lib/hooks/HookSwr'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  RollbackOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Modal,
  Space,
  Table,
  Tag,
  notification,
} from 'antd'
import dayjs from 'dayjs'

const { confirm } = Modal

const Posts = () => {
  const { data, isLoading, reloadData } = HookSwr({
    path: '/pegawai',
    query: '?status=archived',
  })

  const showConfirmRollback = (params) => {
    confirm({
      title: 'Kembalikan data',
      content: (
        <p>
          yakin untuk mengembalikan data ini `<b>{params.nama}</b>` ?
        </p>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya, Kembalikan',
      cancelText: 'Tidak',
      onOk: () => {
        restoreApi({
          endpoint: `/pegawai/restore/${params.id}`,
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
      title: 'Nama',
      key: 'nama',
      dataIndex: 'nama',
    },
    {
      title: 'Kepala Sekolah',
      key: 'kepala_sekolah',
      dataIndex: 'kepala_sekolah',
      render: (kepala_sekolah) =>
        kepala_sekolah ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Ya
          </Tag>
        ) : (
          <Tag color="magenta" icon={<CloseCircleOutlined />}>
            Tidak
          </Tag>
        ),
    },
    {
      title: 'Nip Lama',
      key: 'nip_lama',
      dataIndex: 'nip_lama',
      render: (nip_lama) => nip_lama || '-',
    },
    {
      title: 'Nip Baru',
      key: 'nip_baru',
      dataIndex: 'nip_baru',
      render: (nip_baru) => nip_baru || '-',
    },
    {
      title: 'Tmt Golongan',
      key: 'tmt_golongan',
      dataIndex: 'tmt_golongan',
      render: (tmt_golongan) =>
        tmt_golongan
          ? dayjs(tmt_golongan).format('DD MMMM YYYY')
          : '-',
    },
    {
      title: 'Tmt Jabatan',
      key: 'tmt_jabatan',
      dataIndex: 'tmt_jabatan',
      render: (tmt_jabatan) =>
        tmt_jabatan ? dayjs(tmt_jabatan).format('DD MMMM YYYY') : '-',
    },
    {
      title: 'Pendidikan Terakhir',
      key: 'pendidikan_terakhir',
      dataIndex: 'pendidikan_terakhir',
      render: (pendidikan_terakhir) =>
        pendidikan_terakhir?.title || '-',
    },
    {
      title: 'Jurusan',
      key: 'jurusan',
      dataIndex: 'jurusan',
      render: (jurusan) => jurusan || '-',
    },
    {
      title: 'Tahun Lulus',
      key: 'tahun_lulus',
      dataIndex: 'tahun_lulus',
      render: (tahun_lulus) => tahun_lulus || '-',
    },
    {
      title: 'PD/PDP/NPD',
      key: 'keturunan',
      dataIndex: 'keturunan',
      render: (keturunan) => keturunan?.title || '-',
    },
    {
      title: 'Golongan',
      key: 'golongan',
      dataIndex: 'golongan',
      render: (golongan) => golongan?.title || '-',
    },
    {
      title: 'Jabatan',
      key: 'jabatan',
      dataIndex: 'jabatan',
      render: (jabatan) => jabatan?.title || '-',
    },
    {
      title: 'Agama',
      key: 'agama',
      dataIndex: 'agama',
      render: (agama) => agama?.title || '-',
    },
    {
      title: 'Keterangan',
      key: 'keterangan',
      dataIndex: 'keterangan',
      render: (keterangan) => keterangan || '-',
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
      title="Pegawai"
      bordered={false}
      extra={[
        <Space key="action-pegawai-trash">
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

export default Posts
