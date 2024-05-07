import { HookSwr } from '@/lib/hooks/HookSwr'
import { Card, Descriptions } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

const Pegawai = () => {
  const router = useRouter()
  const { id } = router?.query || {}
  const {
    data: detailPegawai,
    isLoading,
    reloadData,
  } = HookSwr({
    path: id ? `/pegawai/${id}` : '',
  })

  const items = [
    {
      key: '1',
      label: 'Nama',
      children: detailPegawai?.data?.nama,
      span: 6,
    },
    {
      key: '2',
      label: 'Tempat & Tanggal Lahir',
      children: `${detailPegawai?.data?.tempat_lahir}, ${
        detailPegawai?.data?.tanggal_lahir
          ? dayjs(detailPegawai?.data?.tanggal_lahir)
              .locale('id')
              .format('DD MMMM YYYY')
          : ''
      }`,
      span: 6,
    },
    {
      key: '3',
      label: 'Golongan',
      children: detailPegawai?.data?.golongan?.title || '-',
      span: 6,
    },
    {
      key: '4',
      label: 'NIP Lama',
      children: detailPegawai?.data?.nip_lama || '-',
      span: 6,
    },
    {
      key: '5',
      label: 'NIP Baru',
      children: detailPegawai?.data?.nip_baru || '-',
      span: 6,
    },
    {
      key: '6',
      label: 'Jabatan',
      children: detailPegawai?.data?.jabatan?.title || '-',
      span: 6,
    },
  ]

  return (
    <Card title="Detail Pegawai" bordered={false}>
      <Descriptions
        bordered
        size="small"
        column={{ sm: 24, md: 24, lg: 24 }}
        layout="vertical"
        items={items}
      />
    </Card>
  )
}

export default Pegawai
