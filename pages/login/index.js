/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import { LockTwoTone, MailTwoTone } from '@ant-design/icons'
import { Button, Card, Form, Input, Row } from 'antd'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const cookie = require('cookie')

const Login = () => {
  const router = useRouter()
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})

  const onFinish = async (values) => {
    const expires = new Date()
    expires.setSeconds(expires.getSeconds() + 86400)
    const response = await useMutate({
      prefixUrl: '/login',
      payload: values,
    })
    if (!!response?.success) {
      Cookies.set('token_db_pln', response?.data?.token, {
        expires,
        path: '/',
      })
      router.push({ pathname: '/' })
    }
  }

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
            margin: 0,
            padding: 0,
            fontWeight: 'bold',
          }}
        >
          DASHBOARD PLN
        </h2>
        <p style={{ textAlign: 'center' }}>
          <Image
            src="/pln-logo.png"
            alt="pln-logo"
            width={100}
            height={130}
          />
        </p>
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
          >
            <Input.Password
              prefix={<LockTwoTone twoToneColor="#1890FF" />}
              placeholder="Password ..."
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Link href="/forgot-password">Forgot Password?</Link>
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoadingSubmit}
              type="primary"
              htmlType="submit"
              block
            >
              LOGIN
            </Button>
          </Form.Item>

          {/* <Form.Item>
            <p style={{ textAlign: 'center' }}>
              Belum punya akun sebelumnya?{' '}
              <Link className="register" href="/register">
                Daftar disini
              </Link>
            </p>
          </Form.Item> */}
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

export default Login
