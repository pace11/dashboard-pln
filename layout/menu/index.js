import {
  AimOutlined,
  FileTextOutlined,
  HomeOutlined,
  TagsOutlined,
  UserAddOutlined,
} from '@ant-design/icons'

export const sidebarMenu = ({ role = '' }) => [
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
  ['admin', 'superadmin'].includes(role) && {
    key: 'categories',
    icon: <TagsOutlined />,
    label: 'Categories',
  },
  ['superadmin'].includes(role) && {
    key: 'unit',
    icon: <AimOutlined />,
    label: 'Unit',
  },
  ['admin', 'superadmin'].includes(role) && {
    key: 'user',
    icon: <UserAddOutlined />,
    label: 'User',
  },
]
