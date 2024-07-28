/* eslint-disable react-hooks/rules-of-hooks */
import DownloadExcelFile from '@/components/download-excel-file'
import RoleComponentRender from '@/components/role-component-render'
import { IMAGE_FALLBACK } from '@/constants'
import {
  columnsTitleListNews,
  toExportNewsData,
} from '@/constants/columnDownloadNews'
import { ProfileContext } from '@/context/profileContextProvider'
import {
  checkConditionEdit,
  formatDate,
  imagePreview,
  labelStatus,
  roleUser,
} from '@/helpers/utils'
import { useDownloadFile } from '@/lib/hooks/useDownloadFile'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Image,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const { Paragraph, Text } = Typography

const News = ({ isMobile }) => {
  const profileUser = useContext(ProfileContext)
  const {
    downloadFile,
    fileName,
    data: dataDownload,
    isLoading: isLoadingDownload,
  } = useDownloadFile()
  const { data, isLoading, fetchingData, useMutate } =
    useQueriesMutation({
      prefixUrl: '/posts',
    })
  const [isOpenAdd, setOpenAdd] = useState(false)
  const [isOpenEdit, setOpenEdit] = useState(false)
  const router = useRouter()
  const [form] = Form.useForm()

  const showConfirmDelete = (params) => {
    Modal.confirm({
      title: 'Delete Confirm',
      content: <p>Are you sure ?</p>,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const response = await useMutate({
          prefixUrl: `/post/${params?.id}`,
          method: 'DELETE',
        })
        if (response?.success) {
          fetchingData({ prefixUrl: '/posts' })
        }
      },
      onCancel: () => {},
    })
  }

  const showModalDownload = () => {
    Modal.confirm({
      title: 'Filter Download',
      content: (
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item label="Date Range" name="date_range">
            <DatePicker.RangePicker />
          </Form.Item>
        </Form>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Download',
      cancelText: 'No',
      onOk: async () => {
        const date = form.getFieldValue('date_range')
        const start_date = date?.[0]
          ? dayjs(new Date(date?.[0]))
              .locale('id')
              .format('YYYY-MM-DD')
          : ''
        const end_date = date?.[1]
          ? dayjs(new Date(date?.[1]))
              .locale('id')
              .format('YYYY-MM-DD')
          : ''

        downloadFile({
          prefixUrl: '/posts/download',
          fileName: 'Data News',
          mappingData: [{ columns: columnsTitleListNews }],
          exportDownload: toExportNewsData,
          params: { start_date, end_date },
        })

        form.resetFields()
      },
      onCancel: () => {
        form.resetFields()
      },
    })
  }

  const columns = [
    {
      title: 'Thumbnails',
      render: ({ thumbnail }) => (
        <Image
          src={imagePreview({ data: JSON.parse(thumbnail) })}
          alt={imagePreview({ data: JSON.parse(thumbnail) })}
          fallback={IMAGE_FALLBACK}
        />
      ),
    },
    {
      title: 'Title',
      render: ({ title }) => (
        <Paragraph ellipsis={{ rows: 5 }}>{title}</Paragraph>
      ),
    },
    {
      title: 'Number Release',
      render: ({ number_release }) =>
        number_release ? (
          <Paragraph ellipsis={{ rows: 5 }} copyable>
            {number_release}
          </Paragraph>
        ) : (
          '-'
        ),
    },
    {
      title: 'Slug',
      render: ({ slug }) => (
        <Paragraph ellipsis={{ rows: 4 }}>{slug}</Paragraph>
      ),
    },
    {
      title: 'Category',
      render: ({ categories }) => (
        <Tag color="purple" icon={<TagsOutlined />}>
          {categories?.title}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => labelStatus(status)?.tag,
    },
    {
      title: 'Unit',
      key: 'unit',
      dataIndex: 'unit',
      render: (unit) => <Text>{unit?.title ?? 'Kantor Induk'}</Text>,
    },
    {
      title: 'Created By',
      render: ({ user }) => (
        <Space>
          <Text>{user?.email}</Text>
        </Space>
      ),
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
          <RoleComponentRender
            condition={checkConditionEdit({ data: item })}
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
            onClick={() => router.push(`/news/${item?.id}`)}
          >
            Detail
          </Button>
          <RoleComponentRender
            condition={checkConditionEdit({ data: item })}
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
        type="dashed"
        icon={<DownloadOutlined />}
        loading={isLoadingDownload}
        onClick={() => showModalDownload()}
      >
        Download
      </Button>
      <Button
        icon={<ReloadOutlined />}
        onClick={() => fetchingData({ prefixUrl: '/posts' })}
      >
        Reload Data
      </Button>
      <RoleComponentRender
        condition={['creator'].includes(
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
          Add Post
        </Button>
      </RoleComponentRender>
    </Space>,
  ]

  return (
    <>
      {!!fileName && (
        <DownloadExcelFile
          fileName={fileName}
          dataDownload={dataDownload}
        />
      )}
      <Card title="News" bordered={false} extra={extraDesktop}>
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
              fetchingData({ prefixUrl: `/posts?page=${page}` }),
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
              fetchingData({ prefixUrl: '/posts' })
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
              fetchingData({ prefixUrl: `/posts` })
            }}
          />
        )}
      </Card>
    </>
  )
}

export default News
