/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { getMeApi, updatePasswordApi } from '@/helpers/utils'
import { LockTwoTone } from '@ant-design/icons'
import { Button, Card, Form, Input, Row, notification } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const ChangePassword = () => {
  const router = useRouter()
  const { query } = router
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)

  const onFinish = (values) => {
    setIsLoading(true)

    const payload = {
      password: values?.password || null,
    }

    updatePasswordApi({
      token: query?.token,
      payload,
    })
      .then((res) => {
        setIsLoading(false)
        notification.success({
          message: 'Info',
          description: res?.data?.message,
          duration: 1,
        })
        setTimeout(() => {
          router.push({ pathname: '/login' })
        }, 1000)
      })
      .catch((err) => {
        if ([500].includes(err?.response?.status)) {
          setIsLoading(false)
          notification.error({
            message: 'Error',
            description: err?.response?.statusText,
            duration: 1,
          })
        }
      })
  }

  // const onFinishFailed = (errorInfo) => {

  // 	console.log("Failed:", errorInfo);

  // };

  useEffect(() => {
    if (query?.token) {
      getMeApi({ token: query?.token })
        .then((res) => {
          setUser(res?.data?.data)
        })
        .catch((err) => {
          if ([401].includes(err?.response?.status)) {
            notification.warning({
              message: 'Info',
              description: `${err?.response?.data?.message}, Token expired`,
              duration: 1,
            })
          }
        })
    }
  }, [query])

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: '100vh',
        background: '#f5f5f5',
        flexDirection: 'column',
      }}
    >
      <Card bordered={false} style={{ width: '350px' }}>
        <h2
          style={{
            textAlign: 'center',
            margin: '0 0 25px 0',
            padding: 0,
            fontWeight: 'bold',
          }}
        >
          CHANGE PASSWORD
        </h2>
        <Form
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
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockTwoTone twoToneColor="#1890FF" />}
              placeholder="Password ..."
              size="large"
              disabled={!user}
            />
          </Form.Item>

          <Form.Item
            name="retype_password"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please enter password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error('The password entered does not match!'),
                  )
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockTwoTone twoToneColor="#1890FF" />}
              placeholder="Repeat Password ..."
              size="large"
              disabled={!user}
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              block
            >
              SUBMIT
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Row>
  )
}

export default ChangePassword
