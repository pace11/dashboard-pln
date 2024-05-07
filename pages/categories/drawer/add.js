import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Input, Space } from 'antd'
import { useRef } from 'react'

export default function Add({ isMobile, onClose, isOpenAdd }) {
  const { useMutate, isLoadingSubmit } = useQueriesMutation()
  const refButton = useRef(null)
  const [form] = Form.useForm()

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const OnFinish = async (values) => {
    const response = await useMutate({
      prefixUrl: '/category',
      payload: values,
    })
    if (response?.success) {
      form.resetFields()
      onClose()
    }
  }

  return (
    <Drawer
      title={isMobile ? false : 'Add data'}
      width={isMobile ? '100%' : 480}
      placement={isMobile ? 'bottom' : 'right'}
      onClose={() => {
        onClose()
        form.resetFields()
      }}
      open={isOpenAdd}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button
            onClick={() => {
              onClose()
              form.resetFields()
            }}
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
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
        onFinish={OnFinish}
        labelAlign="left"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please enter title!',
            },
          ]}
        >
          <Input size="large" placeholder="Title ..." />
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
