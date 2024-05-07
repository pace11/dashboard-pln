import { Tabs } from 'antd'
import dynamic from 'next/dynamic'

const Posts = dynamic(() => import('./component/posts'))
const Categories = dynamic(() => import('./component/categories'))

const Trash = () => {
  return (
    <Tabs
      defaultActiveKey="pegawai"
      items={[
        { key: 'posts', label: 'Posts', children: <Posts /> },
        {
          key: 'categories',
          label: 'Categories',
          children: <Categories />,
        },
      ]}
    />
  )
}

export default Trash
