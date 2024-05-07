/* eslint-disable react/prop-types */
import { logoutApi } from '@/helpers/utils'
import { LoadingOutlined } from '@ant-design/icons'
import { Card, Col, Row, notification } from 'antd'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

const cookie = require('cookie')

const Logout = () => {

  useEffect(() => {
    const isToken = Cookies.get('token_db_pln')

    if (isToken) {
      logoutApi()
        .then((res) => {
          notification.success({
            message: 'Info',
            description: res?.data?.message,
            duration: 1,
          })
          Cookies.remove('token_db_pln')
          setTimeout(() => {
            window.location.reload()
          }, 500)
        })
        .catch(() => {})
    }
  }, [])

  return (
    <Card>
      <Row justify="center" align="middle">
        <Col>
          <LoadingOutlined style={{ fontSize: '30px' }} />
        </Col>
      </Row>
    </Card>
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

  if (!authorization) {
    res.writeHead(302, {
      Location: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/login`,
    })
    res.end()
  }

  return {
    props: {},
  }
}

export default Logout
