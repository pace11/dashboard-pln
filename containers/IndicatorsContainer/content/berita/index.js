/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { ProfileContext } from '@/context/profileContextProvider'
import { formatDate } from '@/helpers/utils'
import LayoutIndicators from '@/layout/indicators'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Card, Modal, Space, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const { Paragraph, Text } = Typography

const Berita = ({ isMobile }) => {
  const router = useRouter()
  const profileUser = useContext(ProfileContext)
  const { useMutate } = useQueriesMutation({})
  const { data, isLoading, fetchingData } = useQueriesMutation({
    prefixUrl: `/${router?.query?.slug ?? 'berita'}`,
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
          fetchingData({
            prefixUrl: `/${router?.query?.slug ?? 'berita'}`,
          })
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'Period Date',
      render: ({ period_date }) => (
        <Paragraph>
          {dayjs(new Date(period_date))
            .locale('id')
            .format('YYYY MMMM')}
        </Paragraph>
      ),
    },
    {
      title: 'Target',
      render: ({ target }) => <Text>{target}</Text>,
    },
    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (created_at) => formatDate(created_at),
    },
    {
      title: 'Updated At',
      key: 'updated_at',
      dataIndex: 'updated_at',
      render: (updated_at) => formatDate(updated_at),
    },
    {
      title: 'Aksi',
      fixed: 'right',
      render: (item) => (
        <Space>
          <RoleComponentRender
            condition={
              profileUser?.placement === 'main_office' &&
              profileUser?.type === 'creator'
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
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(
                `/indicators/${router?.query?.slug ?? 'berita'}/${
                  item?.id
                }`,
              )
            }
          >
            Detail
          </Button>
          <RoleComponentRender
            condition={
              profileUser?.placement === 'main_office' &&
              profileUser?.type === 'creator'
            }
          >
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => showConfirmDelete(item)}
              hidden
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
        onClick={() =>
          fetchingData({
            prefixUrl: `/${router?.query?.slug ?? 'berita'}`,
          })
        }
      >
        Reload Data
      </Button>
      <RoleComponentRender
        condition={
          profileUser?.placement === 'main_office' &&
          profileUser?.type === 'creator'
        }
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpenAdd(true)
          }}
        >
          Add New
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
          scroll={{ y: '50vh' }}
          pagination={{
            total: data?.pagination?.total,
            current: data?.pagination?.currentPage,
            pageSize: data?.pagination?.perPage,
            showQuickJumper: false,
            hideOnSinglePage: true,
            showTotal: (total) => `${total} Data`,
            onChange: (page) =>
              fetchingData({
                prefixUrl: `/${
                  router?.query?.slug ?? 'berita'
                }?page=${page}`,
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
              fetchingData({
                prefixUrl: `/${router?.query?.slug ?? 'berita'}`,
              })
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
              fetchingData({
                prefixUrl: `/${router?.query?.slug ?? 'berita'}`,
              })
            }}
          />
        )}
      </Card>
    </LayoutIndicators>
  )
}

export default Berita
