/* eslint-disable react-hooks/rules-of-hooks */
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  InputNumber,
  Space,
} from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useRef } from 'react'

export default function Add({ isMobile, onClose, isOpenAdd }) {
  const router = useRouter()
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async (values) => {
    const payload = { ...values }
    payload.period_date = dayjs(
      new Date(payload?.period_date),
    ).format('YYYY')
    payload.target = payload?.target ?? 0

    const response = await useMutate({
      prefixUrl: `/${router?.query?.slug ?? 'berita'}`,
      payload,
    })
    if (response?.success) {
      onClose()
      form.resetFields()
    }
  }

  const showConfirmClose = () => {
    onClose()
    form.resetFields()
  }

  return (
    <Drawer
      title={isMobile ? false : 'Add'}
      width={isMobile ? '100%' : 600}
      placement={isMobile ? 'bottom' : 'right'}
      onClose={showConfirmClose}
      open={isOpenAdd}
      extra={
        <Space>
          <Button
            onClick={showConfirmClose}
            icon={<CloseOutlined />}
            disabled={isLoadingSubmit}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSubmitClick()}
            icon={<SaveOutlined />}
            type="primary"
            loading={isLoadingSubmit}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 8,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
        // onFinishFailed={onFinishFailed}
        onFinish={onFinish}
        labelAlign="left"
      >
        <Form.Item
          label="Year"
          name="period_date"
          rules={[
            {
              required: true,
              message: 'please select year!',
            },
          ]}
        >
          <DatePicker
            size="large"
            picker="year"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Target" name="target">
          <InputNumber
            min={0}
            size="large"
            placeholder="Target ..."
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item hidden>
          <Button ref={refButton} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
