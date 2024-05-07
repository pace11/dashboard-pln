/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { authApi } from '@/helpers/utils'
import {
    FileTextTwoTone,
    LockTwoTone,
    MailTwoTone,
} from '@ant-design/icons'
import { Button, Card, Form, Input, Row, notification } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const cookie = require('cookie')

const Register = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onFinish = (values) => {
    setIsLoading(true)

    const payload = {
      name: values?.name || null,
      email: values?.email || null,
      password: values?.password || null,
    }

    authApi({
      endpoint: '/register',
      payload,
    })
      .then((res) => {
        setIsLoading(false)
        notification.success({
          message: 'Info',
          description: res?.data?.message,
          duration: 1,
        })
        router.push({ pathname: '/login' })
      })
      .catch((err) => {
        if ([401].includes(err?.response?.status)) {
          setIsLoading(false)
          notification.error({
            message: 'Error',
            description: 'Login gagal',
            duration: 1,
          })
        }
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
          REGISTER
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
            name="name"
            rules={[
              {
                required: true,
                message: 'Harap isikan nama!',
              },
            ]}
          >
            <Input
              prefix={<FileTextTwoTone twoToneColor="#1890FF" />}
              placeholder="Nama ..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Harap isikan format email valid!',
              },
            ]}
          >
            <Input
              prefix={<MailTwoTone twoToneColor="#1890FF" />}
              placeholder="Email ..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Harap isikan password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockTwoTone twoToneColor="#1890FF" />}
              placeholder="Password ..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="retype_password"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Harap isi ulang password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error('Password yang diinputkan tidak sama!'),
                  )
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockTwoTone twoToneColor="#1890FF" />}
              placeholder="Ulangi Password ..."
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              block
            >
              Daftar
            </Button>
          </Form.Item>

          <Form.Item>
            <p style={{ textAlign: 'center' }}>
              Sudah punya akun sebelumnya?{' '}
              <Link className="register" href="/login">
                Login disini
              </Link>
            </p>
          </Form.Item>
        </Form>
      </Card>
    </Row>
  )
}

export async function getServerSideProps(context) {
  const { req, res } = context

  let cookies
  let authorization = null

  if (req.headers.cookie) {
    cookies = cookie.parse(req.headers.cookie)
    authorization = cookies.token_db_pln
  }

  if (authorization) {
    res.writeHead(302, {
      Location: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    })
    res.end()
  }

  return {
    props: {},
  }
}

export default Register
