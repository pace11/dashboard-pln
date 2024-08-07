import {
  AimOutlined,
  FileTextOutlined,
  HomeOutlined,
  StockOutlined,
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
    key: 'news',
    icon: <FileTextOutlined />,
    label: 'News',
  },
  {
    key: 'indicators',
    icon: <StockOutlined />,
    label: 'Indicators',
  },
  ['superadmin'].includes(role) && {
    key: 'categories-news',
    icon: <TagsOutlined />,
    label: 'Categories News',
  },
  ['superadmin'].includes(role) && {
    key: 'unit',
    icon: <AimOutlined />,
    label: 'Unit',
  },
  ['superadmin'].includes(role) && {
    key: 'user',
    icon: <UserAddOutlined />,
    label: 'User',
  },
]
