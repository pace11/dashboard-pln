import { COLOR } from '@/constants'
import { ProfileContextProvider } from '@/context/profileContextProvider'
import '@/styles/globals.css'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import 'dayjs/locale/id'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import Layout from '../layout'

export default function App({ Component, pageProps }) {
  const isAuthorized = Cookies.get('token_db_pln')
  const [isMobile, setIsMobile] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    )
  }, [])

  if (!hasMounted) {
    return null
  }

  if (!isAuthorized) {
    return <Component {...pageProps} isMobile={isMobile} />
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedColor: COLOR.PRIMARY,
          },
          Tabs: {
            itemHoverColor: COLOR.PRIMARY,
            itemSelectedColor: COLOR.PRIMARY,
            inkBarColor: COLOR.PRIMARY,
            itemActiveColor: COLOR.PRIMARY,
          },
          Layout: {
            triggerBg: COLOR.PRIMARY,
          },
          Button: {
            colorPrimary: COLOR.PRIMARY,
            colorPrimaryActive: COLOR.PRIMARY,
            colorPrimaryHover: COLOR.PRIMARY_HOVER,
          },
          Table: {
            headerBg: COLOR.PRIMARY_SOFT,
            headerSplitColor: COLOR.PRIMARY,
            borderColor: COLOR.PRIMARY_SOFT,
            rowHoverBg: COLOR.PRIMARY_SOFT_100,
          },
        },
      }}
    >
      <ProfileContextProvider>
        <Layout isMobile={isMobile}>
          <Component {...pageProps} isMobile={isMobile} />
        </Layout>
      </ProfileContextProvider>
    </ConfigProvider>
  )
}
