import { ProfileContext } from '@/context/profileContextProvider'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import { SaveOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
} from 'antd'
import { useRouter } from 'next/router'
import { useContext, useEffect, useRef } from 'react'

export default function Edit() {
  const router = useRouter()
  const profileUser = useContext(ProfileContext)
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})

  const refButton = useRef(null)
  const [form] = Form.useForm()

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const OnFinish = async (values) => {
    const payload = {
      name: values?.name,
      ...(values?.email !== values?.email_old && {
        email: values?.email,
      }),
      ...(values?.password && { password: values?.password }),
    }

    const response = await useMutate({
      prefixUrl: `/user/profile/${profileUser?.id}`,
      method: 'PATCH',
      payload,
    })
    if (response?.success) {
      router.push('/logout')
    }
  }

  useEffect(() => {
    if (profileUser) {
      form.setFieldsValue({
        name: profileUser?.name,
        email: profileUser?.email,
        email_old: profileUser?.email,
        password: '',
      })
    }
  }, [profileUser, form])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Alert
          message="Informational Notes"
          description="After making changes, you will be redirected to login again"
          type="info"
          showIcon
        />
      </Col>
      <Col span={24}>
        <Card
          title="Profile"
          extra={
            <Space>
              <Button
                onClick={() => onSubmitClick()}
                icon={<SaveOutlined />}
                type="primary"
                loading={isLoadingSubmit}
              >
                Save
              </Button>
            </Space>
          }
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
            onFinish={OnFinish}
            labelAlign="left"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please enter name!',
                },
              ]}
            >
              <Input size="large" placeholder="Name ..." />
            </Form.Item>
            <Form.Item label="Email" name="email_old" hidden>
              <Input placeholder="Email ..." size="large" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Harap isikan format email valid!',
                },
              ]}
            >
              <Input placeholder="Email ..." size="large" />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password
                placeholder="Password ..."
                size="large"
              />
            </Form.Item>
            <Form.Item hidden>
              <Button
                ref={refButton}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}
