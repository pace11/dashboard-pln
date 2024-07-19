/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { KEY_STEP } from '@/constants'
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
  LinkOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
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
    useMutate,
    isLoadingSubmit,
  } = useQueriesMutation({
    enabled: !!router?.query?.id,
    prefixUrl: `/media/${router?.query?.id}`,
  })

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
          formStatus.resetFields(),
            fetchingData({ prefixUrl: `/media/${router?.query?.id}` })
        }
      },
      onCancel: () => formStatus.resetFields(),
    })
  }

  const items = [
    {
      key: '1',
      label: 'Title',
      children: detailPost?.data?.title,
    },
    {
      key: '2',
      label: 'Created By',
      children: (
        <Space direction="vertical">
          <Typography.Text>
            {detailPost?.data?.user?.name}
          </Typography.Text>
          <Typography.Text>{`(${detailPost?.data?.user?.email})`}</Typography.Text>
        </Space>
      ),
    },
    {
      key: '3',
      label: 'Url',
      children: (
        <Space direction="vertical">
          <Typography.Paragraph>
            {detailPost?.data?.url}
          </Typography.Paragraph>
          <Button
            icon={<LinkOutlined />}
            type="dashed"
            onClick={() =>
              window.open(detailPost?.data?.url, '_blank')
            }
            size="small"
          >
            Open Url
          </Button>
        </Space>
      ),
    },
    {
      key: '4',
      label: 'Target Post',
      children: detailPost?.data?.target_post,
    },
    {
      key: '5',
      label: 'Caption',
      children: detailPost?.data?.caption,
    },
  ]

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
                      profileUser?.placement === 'main_office' ||
                      !profileUser?.placement
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
                      profileUser?.placement === 'main_office' ||
                      !profileUser?.placement
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
                      profileUser?.placement === 'main_office' ||
                      !profileUser?.placement
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
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card title="Log Status" size="small">
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
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Detail" size="small">
              <Descriptions bordered items={items} />
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
            fetchingData({ prefixUrl: `/media/${router?.query?.id}` })
          }}
        />
      )}
    </LayoutIndicators>
  )
}
