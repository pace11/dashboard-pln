/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { IMAGE_FALLBACK } from '@/constants'
import { ProfileContext } from '@/context/profileContextProvider'
import { formatDate, labelStatus } from '@/helpers/utils'
import LayoutIndicators from '@/layout/indicators'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  EditOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
  FileSearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

const Edit = dynamic(() => import('./drawer/edit'))

export default function PostsDetail({ isMobile }) {
  const profileUser = useContext(ProfileContext)
  const router = useRouter()
  const [form] = Form.useForm()
  const [formStatus] = Form.useForm()
  const [isOpenEdit, setOpenEdit] = useState(false)

  const { data: categories } = useQueriesMutation({
    prefixUrl: '/categories',
  })

  const {
    data: detailPost,
    fetchingData,
    isLoading,
    useMutate,
    isLoadingSubmit,
  } = useQueriesMutation(
    {
      enabled: !!router?.query?.id,
      prefixUrl: `/media/${router?.query?.id}`,
    },
    {
      onSuccess: ({ result }) => {
        form.setFieldsValue({
          title: result?.data?.title || '',
          description: result?.data?.description || '',
          thumbnail: result?.data?.thumbnail || '',
          posted: result?.data?.posted || false,
          banner: result?.data?.banner || false,
          categories_id: result?.data?.categories_id || '',
        })
      },
    },
  )

  const showConfirmChangeStatus = ({ type }) => {
    Modal.confirm({
      title: `Are you sure ${type} this post ?`,
      content: (
        <Form
          form={formStatus}
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
          <Form.Item label="Status" name="status" hidden>
            <Input size="large" placeholder="Remarks ..." />
          </Form.Item>
          <Form.Item label="Remarks" name="remarks">
            <Input.TextArea size="large" placeholder="Remarks ..." />
          </Form.Item>
        </Form>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const response = await useMutate({
          prefixUrl: `/media/status/${router?.query?.id}`,
          payload: {
            status: formStatus.getFieldValue('status') || '',
            remarks: formStatus.getFieldValue('remarks') || '',
          },
          method: 'PATCH',
        })
        if (response?.success) {
          fetchingData({ prefixUrl: `/media/${router?.query?.id}` })
        }
      },
      onCancel: () => formStatus.resetFields(),
    })
  }

  return (
    <LayoutIndicators>
      <Card
        extra={[
          <Space key="action-posts-detail">
            <RoleComponentRender
              condition={
                (!!detailPost?.data?.is_checker ||
                  !!detailPost?.data?.is_superadmin) &&
                ['created', 'final_created', 'approved'].includes(
                  detailPost?.data?.status,
                )
              }
            >
              <Button
                icon={<FileSearchOutlined />}
                type="primary"
                loading={isLoadingSubmit}
                onClick={() => {
                  showConfirmChangeStatus({ type: 'checked' })
                  formStatus.setFieldsValue({
                    status:
                      profileUser?.placement === 'main_office'
                        ? 'final_checked'
                        : 'checked',
                  })
                }}
              >
                Checked
              </Button>
            </RoleComponentRender>
            <RoleComponentRender
              condition={
                (!!detailPost?.data?.is_approver ||
                  !!detailPost?.data?.is_superadmin) &&
                ['checked', 'final_checked'].includes(
                  detailPost?.data?.status,
                )
              }
            >
              <Button
                icon={<FileDoneOutlined />}
                type="primary"
                loading={isLoadingSubmit}
                onClick={() => {
                  showConfirmChangeStatus({ type: 'approved' })
                  formStatus.setFieldsValue({
                    status:
                      profileUser?.placement === 'main_office'
                        ? 'final_approved'
                        : 'approved',
                  })
                }}
              >
                Approved
              </Button>
            </RoleComponentRender>
            <RoleComponentRender
              condition={
                (!!detailPost?.data?.is_approver ||
                  !!detailPost?.data?.is_superadmin) &&
                ['checked', 'final_checked'].includes(
                  detailPost?.data?.status,
                )
              }
            >
              <Button
                icon={<FileExclamationOutlined />}
                type="primary"
                loading={isLoadingSubmit}
                danger
                onClick={() => {
                  showConfirmChangeStatus({ type: 'rejected' })
                  formStatus.setFieldsValue({
                    status:
                      profileUser?.placement === 'main_office'
                        ? 'final_rejected'
                        : 'rejected',
                  })
                }}
              >
                Rejected
              </Button>
            </RoleComponentRender>
            <RoleComponentRender
              condition={
                !!detailPost?.data?.is_own_post ||
                !!detailPost?.data?.is_superadmin ||
                !!detailPost?.data?.is_checker ||
                !!detailPost?.data?.is_approver
              }
            >
              <Button
                type="dashed"
                icon={<EditOutlined />}
                onClick={() => setOpenEdit(detailPost?.data)}
              >
                Edit
              </Button>
            </RoleComponentRender>
          </Space>,
        ]}
      >
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
          <Row>
            <Col span={24}>
              {labelStatus(detailPost?.data?.status)?.alert}
            </Col>
          </Row>
          <Form.Item
            label="Title"
            name="title"
          >
            <Typography.Text>{detailPost?.data?.title}</Typography.Text>
          </Form.Item>
          <Form.Item label="Created By">
            <Space>
              <UserOutlined />
              <Typography.Text>
                {detailPost?.data?.user?.name}
              </Typography.Text>
              <Typography.Text>{`(${detailPost?.data?.user?.email})`}</Typography.Text>
            </Space>
          </Form.Item>
          <Form.Item
            label="Url"
            name="url"
          >
            <Typography.Text>{detailPost?.data?.url}</Typography.Text>
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col span={10}>
              <Image
                src={`${process.env.NEXT_PUBLIC_PATH_IMAGE}/${detailPost?.data?.thumbnail}`}
                alt={detailPost?.data?.thumbnail}
                fallback={IMAGE_FALLBACK}
              />
            </Col>
            <Col span={14}>
              <Row gutter={[16, 16]}>
                <Col lg={12}>
                  <Form.Item
                    label="Category"
                    name="categories_id"
                    rules={[
                      {
                        required: true,
                        message: 'Please select category!',
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      placeholder="Select category ..."
                      notFoundContent="Data tidak ditemukan"
                      disabled
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(
                            optionB.children.toLowerCase(),
                          )
                      }
                    >
                      {categories?.data?.map((item) => (
                        <Select.Option
                          key={item?.id}
                          value={item?.id}
                        >
                          {item?.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="Posted" name="posted">
                    <Switch disabled />
                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="Banner" name="banner">
                    <Switch disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col lg={24}>
                  <Table
                    columns={[
                      {
                        title: 'Checked By',
                        render: (item) => (
                          <Space direction="vertical">
                            <Typography.Text>
                              {formatDate(item?.checked_by_date)}
                            </Typography.Text>
                            <Typography.Text>
                              {item?.checked_by_email}
                            </Typography.Text>
                            <Typography.Text mark>
                              {item?.checked_by_remarks
                                ? `remarks: ${item?.checked_by_remarks}`
                                : ''}
                            </Typography.Text>
                          </Space>
                        ),
                      },
                      {
                        title: 'Final Checked By',
                        render: (item) => (
                          <Space direction="vertical">
                            <Typography.Text>
                              {formatDate(
                                item?.final_checked_by_date,
                              )}
                            </Typography.Text>
                            <Typography.Text>
                              {item?.final_checked_by_email}
                            </Typography.Text>
                            <Typography.Text mark>
                              {item?.final_checked_by_remarks
                                ? `remarks: ${item?.final_checked_by_remarks}`
                                : ''}
                            </Typography.Text>
                          </Space>
                        ),
                      },
                      {
                        title: 'Approved By',
                        render: (item) => (
                          <Space direction="vertical">
                            <Typography.Text>
                              {formatDate(item?.approved_by_date)}
                            </Typography.Text>
                            <Typography.Text>
                              {item?.approved_by_email}
                            </Typography.Text>
                            <Typography.Text mark>
                              {item?.approved_by_remarks
                                ? `remarks: ${item?.approved_by_remarks}`
                                : ''}
                            </Typography.Text>
                          </Space>
                        ),
                      },
                      {
                        title: 'Final Approved By',
                        render: (item) => (
                          <Space direction="vertical">
                            <Typography.Text>
                              {formatDate(
                                item?.final_approved_by_date,
                              )}
                            </Typography.Text>
                            <Typography.Text>
                              {item?.final_approved_by_email}
                            </Typography.Text>
                            <Typography.Text mark>
                              {item?.final_approved_by_remarks
                                ? `remarks: ${item?.final_approved_by_remarks}`
                                : ''}
                            </Typography.Text>
                          </Space>
                        ),
                      },
                      {
                        title: 'Rejected By',
                        render: (item) => (
                          <Space direction="vertical">
                            <Typography.Text>
                              {formatDate(item?.rejected_by_date)}
                            </Typography.Text>
                            <Typography.Text>
                              {item?.rejected_by_email}
                            </Typography.Text>
                            <Typography.Text mark>
                              {item?.rejected_by_remarks
                                ? `remarks: ${item?.rejected_by_remarks}`
                                : ''}
                            </Typography.Text>
                          </Space>
                        ),
                      },
                      {
                        title: 'Final Rejected By',
                        render: (item) => (
                          <Space direction="vertical">
                            <Typography.Text>
                              {formatDate(
                                item?.final_rejected_by_date,
                              )}
                            </Typography.Text>
                            <Typography.Text>
                              {item?.final_rejected_by_email}
                            </Typography.Text>
                            <Typography.Text mark>
                              {item?.final_rejected_by_remarks
                                ? `remarks: ${item?.final_rejected_by_remarks}`
                                : ''}
                            </Typography.Text>
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={[detailPost?.data]}
                    loading={isLoading}
                    style={{ width: '100%' }}
                    size="small"
                    pagination={false}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item label="Description" name="description">
            <div
              dangerouslySetInnerHTML={{
                __html: detailPost?.data?.description,
              }}
            />
          </Form.Item>
        </Form>
      </Card>
      {isOpenEdit && (
        <Edit
          isMobile={isMobile}
          isOpen={isOpenEdit}
          onClose={() => {
            setOpenEdit(false)
            Modal.destroyAll()
            fetchingData({ prefixUrl: `/media/${router?.query?.id}` })
          }}
        />
      )}
    </LayoutIndicators>
  )
}
