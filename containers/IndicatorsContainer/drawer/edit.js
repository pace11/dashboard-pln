/* eslint-disable react-hooks/rules-of-hooks */
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, InputNumber, Space } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

export default function Edit({ onClose, isOpen }) {
  const router = useRouter()
  const slug = router?.query?.slug ?? 'berita'
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async (values) => {
    const payload = {
      target: values?.target ?? 0,
    }

    const response = await useMutate({
      prefixUrl: `/${slug}/${isOpen?.id}`,
      method: 'PATCH',
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

  useEffect(() => {
    if (!!isOpen) {
      form.setFieldsValue({
        target: isOpen?.target ?? 0,
      })
    }
  }, [isOpen, form])

  return (
    <Drawer
      title="Edit"
      width={600}
      placement="right"
      onClose={showConfirmClose}
      open={isOpen}
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
        onFinish={onFinish}
        labelAlign="left"
      >
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
