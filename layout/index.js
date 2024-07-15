import { ProfileContext } from '@/context/profileContextProvider'
import {
  DatabaseOutlined,
  DeleteOutlined,
  LogoutOutlined,
  NotificationOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Badge,
  Breadcrumb,
  Dropdown,
  Layout,
  Menu,
  Row,
  Tabs,
  Tag,
  Typography,
  theme,
} from 'antd'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { sidebarMenu } from './menu'

const { Title } = Typography
const { Header, Content, Footer, Sider } = Layout

const LayoutApp = ({ children, isMobile }) => {
  const router = useRouter()
  const profileUser = useContext(ProfileContext)
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(null)
  const [activeKey, setActiveKey] = useState('/')
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const HandleMenuSelect = ({ key, selectedKeys, keyPath }) => {
    switch (keyPath.length) {
      case 2:
        router.replace(
          `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${
            keyPath[keyPath.length - 1]
          }/${key}`,
        )
        break
      default:
        router.replace(
          `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${key}`,
        )
    }
    setSelectedKeys(selectedKeys)
  }

  const onMenuClick = ({ key }) => {
    const path = {
      logout: '/logout',
      trash: '/trash',
      notifications: '/notifications',
    }
    router.push({ pathname: path[key] })
  }

  const items = ({ role = '' }) => [
    {
      key: 'notifications',
      label: <Badge dot>Notifications</Badge>,
      icon: <NotificationOutlined />,
    },
    ['admin', 'superadmin'].includes(role) && {
      key: 'trash',
      label: 'Trash',
      icon: <DeleteOutlined />,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
    },
  ]

  const nestedUrl = () => {
    const arrayPath = String(router?.asPath)?.split('/')?.slice(1)
    let path = '/'
    const arr = [
      {
        url: '/',
        title: 'Home',
        isLastIndex: false,
      },
    ]
    arrayPath?.map((item, idx) => {
      path = path.concat(`${item}/`)
      arr.push({
        url: path,
        title: item,
        isLastIndex: arrayPath?.length === idx + 1,
      })
    })
    return arr
  }

  useEffect(() => {
    const newRouter = router?.asPath.replace('/', '').split('/')
    const arrRouter =
      router?.asPath === '/' ? router?.asPath : newRouter
    setSelectedKeys(arrRouter)
    setActiveKey(arrRouter !== '/' ? `${arrRouter.toString()}` : '/')
  }, [router.asPath])

  return (
    <>
      <Head>
        <title>Dashboard SIMPEG - SMKN 2 Jayapura</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        style={{
          height: '100vh',
          width: '100%',
        }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ background: colorBgContainer }}
          hidden={isMobile}
        >
          <Menu
            onSelect={HandleMenuSelect}
            selectedKeys={selectedKeys}
            mode="inline"
            items={sidebarMenu({ role: profileUser?.type })}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 15px',
              background: colorBgContainer,
            }}
          >
            <Title style={{ margin: 0, padding: 0 }} level={5}>
              <DatabaseOutlined /> DASHBOARD
            </Title>
            <Row>
              <Dropdown.Button
                size="middle"
                menu={{
                  items: items({ role: profileUser?.type }),
                  onClick: onMenuClick,
                }}
              >
                {!isMobile ? `Hi 👋, ${profileUser?.email}` : ''}
                <Tag
                  color="green"
                  icon={<UserOutlined />}
                  style={{ marginLeft: '5px' }}
                >
                  {profileUser?.type}
                </Tag>
              </Dropdown.Button>
            </Row>
          </Header>
          <Content
            className="content-dashboard"
            style={{
              margin: '0 15px',
              overflowY: 'scroll',
              paddingBottom: '15px',
            }}
          >
            <Breadcrumb
              items={nestedUrl()?.map((item) => ({
                title: !item?.isLastIndex ? (
                  <Link href={item?.url}>{item?.title}</Link>
                ) : (
                  item?.title
                ),
              }))}
              style={{ padding: '10px 0' }}
            />
            {children}
          </Content>
          <Footer
            style={
              isMobile
                ? {
                    padding: '0 15px',
                    background: '#FFF',
                  }
                : { textAlign: 'center' }
            }
          >
            {isMobile ? (
              <Tabs
                defaultActiveKey="/"
                activeKey={activeKey}
                items={sidebarMenu().map((item) => {
                  return {
                    label: (
                      <span>
                        {item?.icon}
                        {item.label}
                      </span>
                    ),
                    key: item?.key,
                  }
                })}
                onChange={(val) => {
                  setActiveKey(val)
                  router.push({
                    pathname: val === '/' ? '/' : `/${val}`,
                  })
                }}
              />
            ) : (
              <span>
                DASHBOARD PLN <ThunderboltOutlined /> -{' '}
                <b>{` v${process.env.NEXT_PUBLIC_APP_VERSION}`}</b>
              </span>
            )}
          </Footer>
        </Layout>
      </Layout>
    </>
  )
}
export default LayoutApp
