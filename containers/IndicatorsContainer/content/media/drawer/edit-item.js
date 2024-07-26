/* eslint-disable react-hooks/rules-of-hooks */
import { MEDIA_POST } from '@/constants'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import {
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Space,
} from 'antd'
import { useEffect, useRef, useState } from 'react'

export default function Edit({ isMobile, onClose, isOpen }) {
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isEditing, setEditing] = useState(false)

  const onSubmitClick = () => {
    // `current` points to the mounted text input element
    refButton.current.click()
  }

  const onFinish = async (values) => {
    const response = await useMutate({
      prefixUrl: `/media/${isOpen?.id}`,
      method: 'PATCH',
      payload: values,
    })
    if (response?.success) {
      onClose()
      form.resetFields()
    }
  }

  const showConfirmClose = () => {
    if (isEditing) {
      Modal.confirm({
        title: 'Close Confirm',
        content: (
          <p>
            Are you sure you want to leave this form? Previous data
            will not be saved ?
          </p>
        ),
        icon: <ExclamationCircleOutlined />,
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          onClose()
          form.resetFields()
          setEditing(false)
        },
        onCancel: () => {},
      })
    } else {
      onClose()
      form.resetFields()
      setEditing(false)
    }
  }

  useEffect(() => {
    if (!!isOpen) {
      form.setFieldsValue({
        title: isOpen?.title || '',
        url: isOpen?.url || '',
        caption: isOpen?.caption || '',
        target_post: isOpen?.target_post || '',
      })
    }
  }, [isOpen, form])

  return (
    <Drawer
      title={isMobile ? false : 'Edit Post'}
      width={isMobile ? '100%' : 900}
      placement={isMobile ? 'bottom' : 'right'}
      onClose={showConfirmClose}
      open={isOpen}
      bodyStyle={{ paddingBottom: 80 }}
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
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
        // onFinishFailed={onFinishFailed}
        onFinish={onFinish}
        labelAlign="left"
        onValuesChange={(value) => setEditing(!!value)}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'please enter title!',
            },
          ]}
        >
          <Input.TextArea size="large" placeholder="Title ..." />
        </Form.Item>
        <Form.Item
          label="Url"
          name="url"
          rules={[
            {
              required: true,
              message: 'please enter url!',
            },
          ]}
        >
          <Input.TextArea
            size="large"
            placeholder="Url example: https://drive.google.com/drive/..."
          />
        </Form.Item>
        <Form.Item
          label="Caption"
          name="caption"
          rules={[
            {
              required: true,
              message: 'please enter caption!',
            },
          ]}
        >
          <Input.TextArea rows={6} size="large" placeholder="Caption ..." />
        </Form.Item>
        <Form.Item
          label="Target Post"
          name="target_post"
          rules={[
            {
              required: true,
              message: 'Please select target post!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Select ..."
            notFoundContent="Data not found"
            filterOption={(input, option) =>
              option.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {MEDIA_POST?.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
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
