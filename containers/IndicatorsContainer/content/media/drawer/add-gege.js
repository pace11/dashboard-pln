import {
  CloseOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Form, Input, Space } from 'antd'

export default function Add({ isMobile, onClose, isOpenAdd }) {
  // Create a form instance
  const [form] = Form.useForm()

  // Handler for form submission
  const handleFinish = (values) => {
    console.log('Form Values:', values)
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

  return (
    <Drawer
      title={isMobile ? false : 'Add'}
      width={isMobile ? '100%' : 900}
      placement={isMobile ? 'bottom' : 'right'}
      onClose={showConfirmClose}
      open={isOpenAdd}
      extra={
        <Space>
          <Button
            onClick={showConfirmClose}
            icon={<CloseOutlined />}
            // disabled={isLoadingSubmit}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSubmitClick()}
            icon={<SaveOutlined />}
            type="primary"
            // loading={isLoadingSubmit}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="dynamic_form"
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.List name="users">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'firstName']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing first name',
                      },
                    ]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'lastName']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing last name',
                      },
                    ]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                  <MinusCircleOutlined
                    style={{ color: 'red' }}
                    onClick={() => remove(name)}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add User
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
