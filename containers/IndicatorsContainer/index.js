/* eslint-disable react-hooks/rules-of-hooks */
import { TAB_LIST } from '@/constants'
import { ProfileContext } from '@/context/profileContextProvider'
import {
  checkConditionEditParent,
  dateStatus,
  formatDate,
} from '@/helpers/utils'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Card, Modal, Space, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

const RoleComponentRender = dynamic(() =>
  import('@/components/role-component-render'),
)

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const IndicatorsContainer = () => {
  const profileUser = useContext(ProfileContext)
  const router = useRouter()
  const slug = router?.query?.slug ?? 'berita'

  const [isOpenAdd, setOpenAdd] = useState(false)
  const [isOpenEdit, setOpenEdit] = useState(false)
  const [param, setParam] = useState({
    page: 1,
    year: '',
  })

  const { useMutate } = useQueriesMutation({})
  const { data, isLoading, fetchingData } = useQueriesMutation({
    prefixUrl: `/${slug}`,
  })

  const showConfirmDelete = (params) => {
    Modal.confirm({
      title: 'Delete Confirm',
      content: <p>Are you sure ?</p>,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const response = await useMutate({
          prefixUrl: `/${slug}/${params?.id}`,
          method: 'DELETE',
        })
        if (response?.success) {
          fetchingData({
            prefixUrl: `/${slug}`,
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
        <Typography.Text>
          {dayjs(new Date(period_date))
            .locale('id')
            .format('YYYY MMMM')}
        </Typography.Text>
      ),
    },
    {
      title: 'Status',
      render: ({ date_status }) => dateStatus({ type: date_status }),
    },
    {
      title: 'Target',
      render: ({ target }) => (
        <Typography.Text>{target}</Typography.Text>
      ),
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
              checkConditionEditParent({
                data: profileUser,
              }) && !['pengelolaan-informasi-public'].includes(slug)
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
            icon={<FolderOpenOutlined />}
            onClick={() =>
              router.push(`/indicators/${slug}/${item?.id}`)
            }
          >
            Open
          </Button>
          <RoleComponentRender
            condition={checkConditionEditParent({
              data: profileUser,
            })}
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

  const extra = [
    <Space key="descktop-action-pegawai">
      <Button
        icon={<ReloadOutlined />}
        onClick={() =>
          fetchingData({
            prefixUrl: `/${slug}`,
          })
        }
      >
        Reload Data
      </Button>
      <RoleComponentRender
        condition={checkConditionEditParent({
          data: profileUser,
        })}
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
    <Card
      title="Indicators"
      tabList={TAB_LIST}
      activeTabKey={slug}
      onTabChange={(key) => router.push(`/indicators/${key}`)}
      extra={extra}
      bordered={false}
    >
      <Table
        rowKey={`key-${slug}`}
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
              prefixUrl: `/${slug}`,
              params: {...param, afafaf }
            }),
        }}
        size="small"
      />
      {isOpenAdd && (
        <Add
          isOpenAdd={isOpenAdd}
          onClose={() => {
            setOpenAdd(false)
            Modal.destroyAll()
            fetchingData({
              prefixUrl: `/${slug}`,
            })
          }}
        />
      )}
      {isOpenEdit && (
        <Edit
          isOpen={isOpenEdit}
          onClose={() => {
            setOpenEdit(false)
            Modal.destroyAll()
            fetchingData({
              prefixUrl: `/${slug}`,
            })
          }}
        />
      )}
    </Card>
  )
}

export default IndicatorsContainer
