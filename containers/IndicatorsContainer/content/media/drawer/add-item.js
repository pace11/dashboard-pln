/* eslint-disable react-hooks/rules-of-hooks */
import { getFilename } from '@/helpers/utils'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  CloseOutlined,
  ExclamationCircleOutlined,
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
  Space,
} from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

const UploadImage = dynamic(() => import('@/components/upload-image'))

export default function Add({ isMobile, onClose, isOpenAdd }) {
  const router = useRouter()
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const { useMutate: useUpload } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isEditing, setEditing] = useState(false)
  const [fileList, setFileList] = useState([])
  const [videoList, setVideoList] = useState([])
  const [media, setMedia] = useState([
    {
      title: '',
      images: [],
      videos: [],
      caption: '',
    },
    {
      title: '',
      images: [],
      videos: [],
      caption: '',
    },
  ])

  const onSubmitClick = () => {
    // `current` points to the mounted text input element
    refButton.current.click()
  }

  const onFinish = async (values) => {
    const payload = {
      title: values?.title || '',
      attachment_images: JSON.stringify(fileList),
      attachment_videos: JSON.stringify(videoList),
      caption: values?.caption,
      media_id: router?.query?.id,
    }

    const response = await useMutate({
      prefixUrl: `/${router?.query?.slug}-item`,
      payload,
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

  const HandleChangeUpload = (event) => {
    if (event?.file?.status === 'removed') {
      setFileList(event?.fileList)
    }
  }

  const HandleChangeVideoUpload = (event) => {
    if (event?.file?.status === 'removed') {
      setVideoList(event?.fileList)
    }
  }

  const HandleBeforeUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await useUpload({
      prefixUrl: `/upload-image`,
      isFormData: true,
      payload: formData,
    })
    if (response?.success) {
      setFileList((oldArray) => [
        ...oldArray,
        {
          uid: oldArray.length + 1,
          name: `${getFilename({ file: response?.data?.image })}`,
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

  const HandleBeforeUploadVideo = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await useUpload({
      prefixUrl: `/upload-image`,
      isFormData: true,
      payload: formData,
    })
    if (response?.success) {
      setVideoList((oldArray) => [
        ...oldArray,
        {
          uid: oldArray.length + 1,
          name: `${getFilename({ file: response?.data?.image })}`,
          status: 'done',
          url: `${response?.data?.image}`,
        },
      ])
    } else {
      setVideoList([
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
        {media?.map((item, idx) => (
          <Row key={idx} gutter={[24, 0]}>
            <Col span={14}>
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
                <Input.TextArea
                  size="large"
                  placeholder="Title ..."
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Attachment Image"
                name="attachment_images"
              >
                <UploadImage
                  fileList={fileList}
                  onChange={HandleChangeUpload}
                  onBeforeUpload={HandleBeforeUpload}
                  maxLength={20}
                />
              </Form.Item>
            </Col>
            <Col span={14}>
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
                <Input.TextArea
                  rows={3}
                  size="large"
                  placeholder="Caption ..."
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Attachment Video"
                name="attachment_videos"
              >
                <UploadImage
                  fileList={videoList}
                  onChange={HandleChangeVideoUpload}
                  onBeforeUpload={HandleBeforeUploadVideo}
                  maxLength={20}
                  type="text"
                />
              </Form.Item>
            </Col>
          </Row>
        ))}
        <Form.Item hidden>
          <Button ref={refButton} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
