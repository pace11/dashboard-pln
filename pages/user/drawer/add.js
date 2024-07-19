import { USER_PLACEMENT } from '@/constants'
import { ProfileContext } from '@/context/profileContextProvider'
import { mappingUserType } from '@/helpers/utils'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Input, Select, Space } from 'antd'
import { useContext, useRef } from 'react'

export default function Add({ isMobile, onClose, isOpenAdd }) {
  const profileUser = useContext(ProfileContext)
  const {
    data: unitsOption,
    useMutate,
    isLoadingSubmit,
  } = useQueriesMutation({
    prefixUrl: '/units/option',
  })
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const formPlacement = Form.useWatch('placement', form)

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const OnFinish = async (values) => {
    const payload = {
      name: values?.name || '',
      email: values?.email || '',
      password: values?.password || '',
      placement: values?.placement || '',
      type: values?.type || '',
      unit_id: values?.unit_id || null,
    }

    const response = await useMutate({
      prefixUrl: '/register',
      payload,
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
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter name!',
            },
          ]}
        >
          <Input size="large" placeholder="Name ..." />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: 'email',
              required: true,
              message: 'Harap isikan format email valid!',
            },
          ]}
        >
          <Input placeholder="Email ..." size="large" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter password!',
            },
          ]}
        >
          <Input.Password placeholder="Password ..." size="large" />
        </Form.Item>
        <Form.Item
          label="Placement"
          name="placement"
          rules={[
            {
              required: true,
              message: 'Please select placement!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Select placement ..."
            notFoundContent="Data not found"
            filterOption={(input, option) =>
              option.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            {USER_PLACEMENT?.map((item) => (
              <Select.Option key={item?.value} value={item?.value}>
                {item?.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Unit"
          name="unit_id"
          hidden={formPlacement === 'main_office'}
          rules={
            formPlacement === 'main_office'
              ? []
              : [
                  {
                    required: true,
                    message: 'Please select unit!',
                  },
                ]
          }
        >
          <Select
            size="large"
            showSearch
            placeholder="Select unit ..."
            notFoundContent="Data not found"
            filterOption={(input, option) =>
              option.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            {unitsOption?.data?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              required: true,
              message: 'Please select type user!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Select type user ..."
            notFoundContent="Data not found"
            filterOption={(input, option) =>
              option.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            {mappingUserType({ user: profileUser })?.map((item) => (
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
