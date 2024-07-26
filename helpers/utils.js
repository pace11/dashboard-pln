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
    final_approved_2: {
      alert: (
        <Alert
          message="Post Final Approved 2"
          type="success"
          showIcon
        />
      ),
      tag: <Badge status="success" text="Final Approved 2" />,
    },
    final_approved_3: {
      alert: (
        <Alert
          message="Post Final Approved 3"
          type="success"
          showIcon
        />
      ),
      tag: <Badge status="success" text="Final Approved 3" />,
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
    final_rejected_2: {
      alert: (
        <Alert
          message="Post Final Rejected 2"
          type="error"
          showIcon
        />
      ),
      tag: <Badge status="error" text="Final Rejected 2" />,
    },
    final_rejected_3: {
      alert: (
        <Alert
          message="Post Final Rejected 3"
          type="error"
          showIcon
        />
      ),
      tag: <Badge status="error" text="Final Rejected 3" />,
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
      subTitle: data?.user?.email,
      description: formatDate(data?.created_at, false),
    },
    {
      title: 'Checked',
      subTitle: data?.checked_by_email,
      description: (
        <Space direction="vertical">
          <Typography.Text type="secondary">
            {formatDate(data?.checked_by_date, false)}
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
      subTitle: data?.approved_by_email || data?.rejected_by_email,
      description: (
        <>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.approved_by_date, false)}
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
      title: 'Final Created',
      subTitle: data?.final_created_by_email,
      description: (
        <Space direction="vertical">
          <Typography.Text type="secondary">
            {formatDate(data?.final_created_by_date, false)}
          </Typography.Text>
          <Typography.Text mark>
            {data?.final_created_by_remarks
              ? `remarks: ${data?.final_created_by_remarks}`
              : ''}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Final Checked',
      subTitle: data?.final_checked_by_email,
      description: (
        <Space direction="vertical">
          <Typography.Text type="secondary">
            {formatDate(data?.final_checked_by_date, false)}
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
      title: 'Final Approved 1',
      subTitle:
        data?.final_approved_by_email ||
        data?.final_rejected_by_email,
      description: (
        <>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.final_approved_by_date, false)}
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
            <Typography.Text mark>
              {data?.final_rejected_by_remarks
                ? `remarks: ${data?.final_rejected_by_remarks}`
                : ''}
            </Typography.Text>
          </Space>
        </>
      ),
    },
    {
      title: 'Final Approved 2',
      subTitle:
        data?.final_approved_2_by_email ||
        data?.final_rejected_2_by_email,
      description: (
        <>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.final_approved_2_by_date, false)}
            </Typography.Text>
            <Typography.Text mark>
              {data?.final_approved_2_by_remarks
                ? `remarks: ${data?.final_approved_2_by_remarks}`
                : ''}
            </Typography.Text>
          </Space>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.final_rejected_2_by_date, false)}
            </Typography.Text>
            <Typography.Text mark>
              {data?.final_rejected_2_by_remarks
                ? `remarks: ${data?.final_rejected_2_by_remarks}`
                : ''}
            </Typography.Text>
          </Space>
        </>
      ),
    },
    {
      title: 'Final Approved 3',
      subTitle:
        data?.final_approved_3_by_email ||
        data?.final_rejected_3_by_email,
      description: (
        <>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.final_approved_3_by_date, false)}
            </Typography.Text>
            <Typography.Text mark>
              {data?.final_approved_3_by_remarks
                ? `remarks: ${data?.final_approved_3_by_remarks}`
                : ''}
            </Typography.Text>
          </Space>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              {formatDate(data?.final_rejected_3_by_date, false)}
            </Typography.Text>
            <Typography.Text mark>
              {data?.final_rejected_3_by_remarks
                ? `remarks: ${data?.final_rejected_3_by_remarks}`
                : ''}
            </Typography.Text>
          </Space>
        </>
      ),
    },
  ]

  return mapping
}

export const imagePreview = ({ data = [] }) => data?.[0]?.url ?? ''

export const approvedStatus = ({ status = '' }) => {
  const mapping = {
    final_checked: 'final_approved',
    final_approved: 'final_approved_2',
    final_approved_2: 'final_approved_3',
  }
  return mapping?.[status] ?? 'approved'
}

export const rejectedStatus = ({ status = '' }) => {
  const mapping = {
    final_checked: 'final_rejected',
    final_approved: 'final_rejected_2',
    final_approved_2: 'final_rejected_3',
  }
  return mapping?.[status] ?? 'rejected'
}

export const checkConditionApprovedRejected = ({
  data = {},
} = {}) => {
  if (data?.is_approver && ['checked'].includes(data?.status))
    return true
  if (data?.is_approver && ['final_checked'].includes(data?.status))
    return true
  if (
    data?.is_approver_2 &&
    ['final_approved'].includes(data?.status)
  )
    return true
  if (
    data?.is_approver_3 &&
    ['final_approved_2'].includes(data?.status)
  )
    return true
  return false
}

export const checkConditionEdit = ({ data = {} } = {}) => {
  if (
    (!!data?.is_own_post ||
      !!data?.is_superadmin ||
      !!data?.is_creator ||
      !!data?.is_checker ||
      !!data?.is_approver ||
      !!data?.is_approver_2 ||
      !!data?.is_approver_3) &&
    ![
      'rejected',
      'final_rejected',
      'final_rejected_2',
      'final_rejected_3',
    ]
  )
    return true
  return false
}

export const checkConditionRecreate = ({ data = {} } = {}) => {
  if (
    !!data?.is_own_post &&
    !data?.recreated &&
    [
      'rejected',
      'final_rejected',
      'final_rejected_2',
      'final_rejected_3',
    ].includes(data?.status)
  )
    return true
  return false
}

export const getFilename = ({ file = '' } = {}) => {
  if (file) {
    return String(file).split('/images/')?.[1]
  }
}

export function validURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ) // fragment locator
  return !!pattern.test(str)
}
