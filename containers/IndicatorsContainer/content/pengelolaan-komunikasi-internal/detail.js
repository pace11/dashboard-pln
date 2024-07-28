/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { ProfileContext } from '@/context/profileContextProvider'
import {
  checkConditionAddItem,
  checkConditionDeleteItem,
  checkConditionEditItem,
  formatDate,
} from '@/helpers/utils'
import LayoutIndicators from '@/layout/indicators'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

const Add = dynamic(() => import('./drawer/add-child'))
const Edit = dynamic(() => import('./drawer/edit-child'))

const { Text } = Typography

const PengelolaKomunikasiInternalDetail = ({ isMobile }) => {
  const router = useRouter()
  const profileUser = useContext(ProfileContext)
  const { useMutate } = useQueriesMutation({})
  const { data: detail, fetchingData: fetchingDataDetail } =
    useQueriesMutation({
      enabled: !!router?.query?.id,
      prefixUrl: `/${router?.query?.slug}/${router?.query?.id}`,
    })
  const { data, isLoading, fetchingData } = useQueriesMutation({
    enabled: !!router?.query?.id,
    prefixUrl: `/${router?.query?.slug}-item/parent/${router?.query?.id}`,
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
          prefixUrl: `/${router?.query?.slug}-item/${params?.id}`,
          method: 'DELETE',
        })
        if (response?.success) {
          fetchingData({
            prefixUrl: `/${router?.query?.slug}-item/parent/${router?.query?.id}`,
          })
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'Unit',
      render: (item) => <Text>{item?.unit?.title}</Text>,
    },
    {
      title: 'Realization',
      render: ({ realization }) => <Text>{realization}</Text>,
    },
    {
      title: 'Percentage',
      render: ({ value }) => <Text>{value ? `${value}%` : '0'}</Text>,
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
        <Space direction="vertical">
          <RoleComponentRender
            condition={checkConditionEditItem({ data: item })}
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
            type="dashed"
            icon={<EyeOutlined />}
            onClick={() => setOpenEdit({ ...item, isViewOnly: true })}
          >
            View
          </Button>
          <RoleComponentRender
            condition={checkConditionDeleteItem({ data: item })}
          >
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
        onClick={() => {
          fetchingDataDetail({
            prefixUrl: `/${router?.query?.slug}/${router?.query?.id}`,
          })
          fetchingData({
            prefixUrl: `/${router?.query?.slug}-item/parent/${router?.query?.id}`,
          })
        }}
      >
        Reload Data
      </Button>
      <RoleComponentRender
        condition={checkConditionAddItem({ user: profileUser, detail: detail?.data })}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpenAdd(true)
          }}
          loading={isLoading}
          disabled={data?.data?.length}
        >
          Add New
        </Button>
      </RoleComponentRender>
    </Space>,
  ]

  const items = [
    {
      key: '1',
      label: 'Period Date',
      children: `${detail?.data?.period_date ? dayjs(new Date(detail?.data?.period_date))
        .locale('id')
        .format('YYYY MMMM') : '' }`,
    },
    {
      key: '2',
      label: 'Target',
      children: `${detail?.data?.target ?? '0'}`,
    },
  ]

  return (
    <LayoutIndicators>
      <Card
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() =>
                router.push(`/indicators/${router?.query?.slug}`)
              }
            />
            <Text>Back</Text>
          </Space>
        }
        bordered={false}
        extra={extraDesktop}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row>
              <Col span={12}>
                <Descriptions items={items} bordered />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              rowKey="key"
              dataSource={data?.data ?? []}
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
                    prefixUrl: `/${router?.query?.slug}-item/parent/${router?.query?.id}?page=${page}`,
                  }),
              }}
              size="small"
            />
          </Col>
        </Row>
        {isOpenAdd && (
          <Add
            isMobile={isMobile}
            isOpenAdd={isOpenAdd}
            onClose={() => {
              setOpenAdd(false)
              Modal.destroyAll()
              fetchingData({
                prefixUrl: `/${router?.query?.slug}-item/parent/${router?.query?.id}`,
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
                prefixUrl: `/${router?.query?.slug}-item/parent/${router?.query?.id}`,
              })
            }}
          />
        )}
      </Card>
    </LayoutIndicators>
  )
}

export default PengelolaKomunikasiInternalDetail
