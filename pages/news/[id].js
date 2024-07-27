/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { IMAGE_FALLBACK, KEY_STEP } from '@/constants'
import { ProfileContext } from '@/context/profileContextProvider'
import {
  approvedStatus,
  checkConditionApprovedRejected,
  checkConditionEdit,
  checkConditionRecreate,
  rejectedStatus,
  stepProgress,
} from '@/helpers/utils'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  ArrowLeftOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
  FileSearchOutlined,
  InfoCircleOutlined,
  RollbackOutlined,
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
  Space,
  Steps,
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

  const {
    data: detailPost,
    fetchingData,
    isLoading,
  } = useQueriesMutation({
    enabled: !!router?.query?.id,
    prefixUrl: `/post/${router?.query?.id}`,
  })

  const { isLoadingSubmit, useMutate } = useQueriesMutation({})

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
          {/* {[
            'final_checked',
            'final_approved',
            'final_approved_2',
          ].includes(detailPost?.data?.status) &&
            type !== 'rejected' && (
              <Form.Item label="Posted" name="posted">
                <Switch />
              </Form.Item>
            )} */}
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

  const showConfirmRecreate = ({ id }) => {
    Modal.confirm({
      title: 'Recreate post',
      content: `Are you sure re-create this post ?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const response = await useMutate({
          prefixUrl: `/post/recreate/${id}`,
        })

        if (response?.success) {
          router.push(`/news/`)
        }
      },
      onCancel: () => {},
    })
  }

  return (
    <>
      <Card
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push('/news')}
            />
            <Typography.Text>Back</Typography.Text>
          </Space>
        }
        loading={isLoading}
        extra={[
          <Space key="action-posts-detail">
            <RoleComponentRender
              condition={
                !!detailPost?.data?.is_creator &&
                ['approved'].includes(detailPost?.data?.status)
              }
            >
              <Button
                icon={<FileSearchOutlined />}
                type="primary"
                loading={isLoadingSubmit}
                onClick={() => {
                  showConfirmChangeStatus({ type: 'checked' })
                  formStatus.setFieldsValue({
                    status: 'final_created',
                  })
                }}
              >
                Done Checking By Creator Induk
              </Button>
            </RoleComponentRender>
            <RoleComponentRender
              condition={
                !!detailPost?.data?.is_checker &&
                ['created', 'final_created'].includes(
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
                Done Checking by Checker
              </Button>
            </RoleComponentRender>
            <RoleComponentRender
              condition={checkConditionApprovedRejected({
                data: detailPost?.data ?? {},
              })}
            >
              <Button
                icon={<FileDoneOutlined />}
                type="primary"
                loading={isLoadingSubmit}
                onClick={() => {
                  showConfirmChangeStatus({ type: 'approved' })
                  formStatus.setFieldsValue({
                    status: approvedStatus({
                      status: detailPost?.data?.status ?? '',
                    }),
                  })
                }}
              >
                Approved
              </Button>
            </RoleComponentRender>
            <RoleComponentRender
              condition={checkConditionApprovedRejected({
                data: detailPost?.data ?? {},
              })}
            >
              <Button
                icon={<FileExclamationOutlined />}
                type="primary"
                loading={isLoadingSubmit}
                danger
                onClick={() => {
                  showConfirmChangeStatus({ type: 'rejected' })
                  formStatus.setFieldsValue({
                    status: rejectedStatus({
                      status: detailPost?.data?.status ?? '',
                    }),
                  })
                }}
              >
                Rejected
              </Button>
            </RoleComponentRender>
            <RoleComponentRender
              condition={checkConditionEdit({
                data: detailPost?.data ?? {},
              })}
            >
              <Button
                type="dashed"
                icon={<EditOutlined />}
                onClick={() => setOpenEdit(detailPost?.data)}
              >
                Edit
              </Button>
            </RoleComponentRender>
            <RoleComponentRender
              condition={checkConditionRecreate({
                data: detailPost?.data,
              })}
            >
              <Button
                type="primary"
                icon={<RollbackOutlined />}
                onClick={() =>
                  showConfirmRecreate({ id: detailPost?.data?.id })
                }
              >
                Re-create News
              </Button>
            </RoleComponentRender>
          </Space>,
        ]}
      >
        <Row gutter={[24, 24]}>
          <Col span={18}>
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
                <Form.Item
                  label="Number Release"
                  tooltip={{
                    title:
                      'Generated by system after final approved 3',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  {detailPost?.data?.number_release && (
                    <Typography.Title level={5} copyable>
                      {detailPost?.data?.number_release}
                    </Typography.Title>
                  )}
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
                    <Form.Item label="Category" name="categories_id">
                      <Typography.Text>
                        {detailPost?.data?.categories?.title}
                      </Typography.Text>
                    </Form.Item>
                  </Col>
                  {/* <Col span={4}>
                    <Form.Item label="Posted" name="posted">
                      {labelYesNo(detailPost?.data?.posted)}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Banner" name="banner">
                      {labelYesNo(detailPost?.data?.banner)}
                    </Form.Item>
                  </Col> */}
                </Row>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Row gutter={[24, 24]}>
                      {detailPost?.data?.thumbnail ? (
                        JSON.parse(detailPost?.data?.thumbnail)?.map(
                          (item) => (
                            <Col span={3} key={item?.uid}>
                              <Image
                                src={item?.url}
                                alt={item?.name}
                                fallback={IMAGE_FALLBACK}
                              />
                            </Col>
                          ),
                        )
                      ) : (
                        <Col span={3}>
                          <Image
                            src=""
                            alt=""
                            fallback={IMAGE_FALLBACK}
                          />
                        </Col>
                      )}
                    </Row>
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
          <Col span={6}>
            <Card title="Log Status" size="small">
              <Row>
                <Col span={24}>
                  <Steps
                    size="small"
                    current={KEY_STEP?.[detailPost?.data?.status]}
                    status={
                      [
                        'rejected',
                        'final_rejected',
                        'final_rejected_2',
                        'final_rejected_3',
                      ].includes(detailPost?.data?.status)
                        ? 'error'
                        : 'finish'
                    }
                    direction="vertical"
                    items={stepProgress({ data: detailPost?.data })}
                  />
                </Col>
              </Row>
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
    </>
  )
}
