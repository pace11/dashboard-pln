/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { ProfileContext } from '@/context/profileContextProvider'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
} from 'antd'
import dynamic from 'next/dynamic'
import { useContext, useRef, useState } from 'react'

const TextEditor = dynamic(() => import('@/components/text-editor'), {
  ssr: false,
})

const UploadImage = dynamic(() => import('@/components/upload-image'))

export default function Add({ isMobile, onClose, isOpenAdd }) {
  const profileUser = useContext(ProfileContext)
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const { data: categories } = useQueriesMutation({
    prefixUrl: '/categories',
  })
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [isEditing, setEditing] = useState(false)

  const onSubmitClick = () => {
    // `current` points to the mounted text input element
    refButton.current.click()
  }

  const onFinish = async (values) => {
    const payload = {
      title: values?.title || '',
      description: values?.description || '',
      thumbnail: fileList?.length > 0 ? JSON.stringify(fileList) : '',
      posted: values?.posted || false,
      banner: values?.banner || false,
      categories_id: values?.categories_id || '',
    }
    const response = await useMutate({ prefixUrl: '/post', payload })
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

  const HandleChangeUpload = (event) => {
    if (event?.file?.status === 'removed') {
      setFileList(event?.fileList)
    }
  }

  const HandleBeforeUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await useMutate({
      prefixUrl: `/upload-image`,
      isFormData: true,
      payload: formData,
    })
    if (response?.success) {
      setFileList((oldArray) => [
        ...oldArray,
        {
          uid: oldArray.length + 1,
          name: `${response?.data?.image}`,
          status: 'done',
          url: `${response?.data?.image}`,
        },
      ])
    } else {
      setFileList([
        {
          uid: '1',
          name: 'image.png',
          status: 'error',
        },
      ])
    }
  }

  return (
    <Drawer
      title={isMobile ? false : 'Add Post'}
      width={isMobile ? '100%' : 900}
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
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              label="Image"
              name="thumbnail"
              tooltip={{
                title:
                  'Maks 10 image, image pertama akan menjadi thumbnails',
                icon: <InfoCircleOutlined />,
              }}
            >
              <UploadImage
                fileList={fileList}
                onChange={HandleChangeUpload}
                onBeforeUpload={HandleBeforeUpload}
                maxLength={10}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Category"
              name="categories_id"
              rules={[
                {
                  required: true,
                  message: 'Please select category!',
                },
              ]}
            >
              <Select
                size="large"
                showSearch
                placeholder="Select category ..."
                notFoundContent="Data tidak ditemukan"
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
                {categories?.data?.map((item) => (
                  <Select.Option key={item?.id} value={item?.id}>
                    {item?.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <RoleComponentRender
            condition={['superadmin', 'admin'].includes(
              profileUser?.type,
            )}
          >
            <Col span={3}>
              <Form.Item label="Posted" name="posted">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Banner" name="banner">
                <Switch />
              </Form.Item>
            </Col>
          </RoleComponentRender>
        </Row>
        <Form.Item label="Description" name="description">
          <TextEditor
            onChange={(value) => console.log('value', value)}
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
