/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { IMAGE_FALLBACK, KEY_STEP } from '@/constants'
import { ProfileContext } from '@/context/profileContextProvider'
import { stepProgress } from '@/helpers/utils'
import LayoutIndicators from '@/layout/indicators'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  EditOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
  FileSearchOutlined,
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
  Steps,
  Switch,
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
      prefixUrl: `/post/${router?.query?.id}`,
    },
    {
      onSuccess: ({ result }) => {
        form.setFieldsValue({
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
          {detailPost?.data?.status === 'final_checked' &&
            type !== 'rejected' && (
              <Form.Item label="Posted" name="posted">
                <Switch />
              </Form.Item>
            )}
        </Form>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const response = await useMutate({
          prefixUrl: `/post/status/${router?.query?.id}`,
          payload: {
            status: formStatus.getFieldValue('status') || '',
            remarks: formStatus.getFieldValue('remarks') || '',
            posted: formStatus.getFieldValue('posted') || '',
          },
          method: 'PATCH',
        })
        if (response?.success) {
          fetchingData({ prefixUrl: `/post/${router?.query?.id}` })
        }
      },
      onCancel: () => formStatus.resetFields(),
    })
  }

  return (
    <LayoutIndicators>
      <Card
        loading={isLoading}
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
                Checked Post
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
                Approved Post
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
                Rejected Post
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
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card title="Log Status" size="small">
              <Row>
                <Col span={24}>
                  <Steps
                    size="small"
                    current={KEY_STEP?.[detailPost?.data?.status]}
                    status={
                      ['rejected', 'final_rejected'].includes(
                        detailPost?.data?.status,
                      )
                        ? 'error'
                        : 'finish'
                    }
                    items={stepProgress({ data: detailPost?.data })}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Detail" size="small">
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
                <Form.Item label="Title" name="title">
                  <Typography.Title level={3}>
                    {detailPost?.data?.title}
                  </Typography.Title>
                </Form.Item>
                <Row gutter={[24, 24]}>
                  <Col span={8}>
                    <Form.Item label="Created By">
                      <Space direction="vertical">
                        <Typography.Text>
                          {detailPost?.data?.user?.name}
                        </Typography.Text>
                        <Typography.Text>{`(${detailPost?.data?.user?.email})`}</Typography.Text>
                      </Space>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
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
                  <Col span={4}>
                    <Form.Item label="Posted" name="posted">
                      <Switch disabled />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Banner" name="banner">
                      <Switch disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_PATH_IMAGE}/${detailPost?.data?.thumbnail}`}
                      alt={detailPost?.data?.thumbnail}
                      fallback={IMAGE_FALLBACK}
                    />
                  </Col>
                  <Col span={24}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: detailPost?.data?.description,
                      }}
                    />
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Card>
      {isOpenEdit && (
        <Edit
          isMobile={isMobile}
          isOpen={isOpenEdit}
          onClose={() => {
            setOpenEdit(false)
            Modal.destroyAll()
            fetchingData({ prefixUrl: `/post/${router?.query?.id}` })
          }}
        />
      )}
    </LayoutIndicators>
  )
}
