import { USER_TYPE } from '@/constants'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { Alert, Badge, Space, Tag, Typography } from 'antd'
import Axios from 'axios'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'

export const getMeApi = async ({ token }) => {
  try {
    const result = await Axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API}/user/me`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const updatePasswordApi = async ({ payload, token }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}/update-password`,
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const authApi = async ({ endpoint, payload }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      data: payload,
    })
    return result
  } catch (error) {
    throw error
  }
}

export const logoutApi = async () => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}/logout`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_db_pln')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const createApi = async ({ endpoint, payload }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_db_pln')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const updateApi = async ({ endpoint, payload }) => {
  try {
    const result = await Axios({
      method: 'PATCH',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_db_pln')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const deleteApi = async ({ endpoint }) => {
  try {
    const result = await Axios({
      method: 'DELETE',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_db_pln')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const restoreApi = async ({ endpoint }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_db_pln')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const randomColor = () => {
  const color = [
    '#f9ca24',
    '#f0932b',
    '#f9ca24',
    '#6ab04c',
    '#5B8FF9',
    '#5B8FF9',
    '#eb4d4b',
    '#eb4d4b',
    '#be2edd',
    '#e056fd',
    '#7ed6df',
    '#30336b',
  ]
  const randomNumber = Math.round(
    Math.random() * (color.length - 0) + 0,
  )
  return color[randomNumber]
}

export const labelStatus = (type) => {
  const msg = {
    created: {
      alert: <Alert message="Post Created" type="warning" showIcon />,
      tag: <Badge status="processing" text="Created" />,
    },
    final_created: {
      alert: (
        <Alert message="Post Final Created" type="warning" showIcon />
      ),
      tag: <Badge status="processing" text="Final Created" />,
    },
    checked: {
      alert: <Alert message="Post Checked" type="info" showIcon />,
      tag: <Badge status="warning" text="Checked" />,
    },
    final_checked: {
      alert: (
        <Alert message="Post Final Checked" type="info" showIcon />
      ),
      tag: <Badge status="warning" text="Final Checked" />,
    },
    approved: {
      alert: (
        <Alert message="Post Approved" type="success" showIcon />
      ),
      tag: <Badge status="success" text="Approved" />,
    },
    final_approved: {
      alert: (
        <Alert
          message="Post Final Approved"
          type="success"
          showIcon
        />
      ),
      tag: <Badge status="success" text="Final Approved" />,
    },
    rejected: {
      alert: <Alert message="Post Rejected" type="error" showIcon />,
      tag: <Badge status="error" text="Rejected" />,
    },
    final_rejected: {
      alert: (
        <Alert message="Post Final Rejected" type="error" showIcon />
      ),
      tag: <Badge status="error" text="Final Rejected" />,
    },
  }

  return msg?.[type] ?? msg.created
}

export const labelYesNo = (status) => {
  return (
    <Tag
      color={status ? 'green' : 'magenta'}
      icon={
        status ? <CheckCircleOutlined /> : <CloseCircleOutlined />
      }
    >
      {status ? 'Yes' : 'No'}
    </Tag>
  )
}

export const roleUser = ({ user = {} }) => {
  return String(user?.type).toLocaleLowerCase()
}

export const newDateWithoutTimezone = (dateObj) => {
  return new Date(dateObj).toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
  })
}

export const mappingUserType = ({ user = {} }) => {
  if (user?.type === 'superadmin') {
    return USER_TYPE
  }

  return USER_TYPE?.filter((item) => !['admin'].includes(item))
}

export const formatDate = (date, isStrip = true) =>
  date
    ? dayjs(date).locale('id').format('DD MMMM YYYY HH:mm')
    : isStrip
    ? '-'
    : ''

export const stepProgress = ({ data = {} } = {}) => {
  const mapping = [
    {
      title: 'Created',
      description: formatDate(data?.created_at, false),
    },
    {
      title: 'Checked',
      description: (
        <Space direction="vertical">
          <Typography.Text type="secondary">
            {formatDate(data?.checked_by_date, false)}
          </Typography.Text>
          <Typography.Text type="secondary">
            {data?.checked_by_email}
          </Typography.Text>
          <Typography.Text mark>
            {data?.checked_by_remarks
              ? `remarks: ${data?.checked_by_remarks}`
              : ''}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Approved',
      description: (
        <>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.approved_by_date, false)}
            </Typography.Text>
            <Typography.Text type="secondary">
              {data?.approved_by_email}
            </Typography.Text>
            <Typography.Text mark>
              {data?.approved_by_remarks
                ? `remarks: ${data?.approved_by_remarks}`
                : ''}
            </Typography.Text>
          </Space>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.rejected_by_date, false)}
            </Typography.Text>
            <Typography.Text type="secondary">
              {data?.rejected_by_email}
            </Typography.Text>
            <Typography.Text mark>
              {data?.rejected_by_remarks
                ? `remarks: ${data?.rejected_by_remarks}`
                : ''}
            </Typography.Text>
          </Space>
        </>
      ),
    },
    {
      title: 'Final Checked',
      description: (
        <Space direction="vertical">
          <Typography.Text type="secondary">
            {formatDate(data?.final_checked_by_date, false)}
          </Typography.Text>
          <Typography.Text type="secondary">
            {data?.final_checked_by_email}
          </Typography.Text>
          <Typography.Text mark>
            {data?.final_checked_by_remarks
              ? `remarks: ${data?.final_checked_by_remarks}`
              : ''}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Final Approved',
      description: (
        <>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.final_approved_by_date, false)}
            </Typography.Text>
            <Typography.Text type="secondary">
              {data?.final_approved_by_email}
            </Typography.Text>
            <Typography.Text mark>
              {data?.final_approved_by_remarks
                ? `remarks: ${data?.final_approved_by_remarks}`
                : ''}
            </Typography.Text>
          </Space>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.final_rejected_by_date, false)}
            </Typography.Text>
            <Typography.Text type="secondary">
              {data?.final_rejected_by_email}
            </Typography.Text>
            <Typography.Text mark>
              {data?.final_rejected_by_remarks
                ? `remarks: ${data?.final_rejected_by_remarks}`
                : ''}
            </Typography.Text>
          </Space>
        </>
      ),
    },
  ]

  return mapping
}
