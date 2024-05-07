import {
  FileTextOutlined,
  HomeOutlined,
  TagsOutlined,
} from '@ant-design/icons'

module.exports = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Home',
  },
  {
    key: 'posts',
    icon: <FileTextOutlined />,
    label: 'Posts',
  },
  {
    key: 'categories',
    icon: <TagsOutlined />,
    label: 'Categories',
  },
]
