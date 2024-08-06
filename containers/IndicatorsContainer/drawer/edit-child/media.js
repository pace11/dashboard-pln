/* eslint-disable react-hooks/rules-of-hooks */
import { COLOR } from '@/constants'
import { getFilename } from '@/helpers/utils'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Space,
} from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

const UploadImage = dynamic(() => import('@/components/upload-image'))

export default function EditChildMedia({ onClose, isOpen }) {
  const router = useRouter()
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const { useMutate: useUpload } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isEditing, setEditing] = useState(false)
  const [media, setMedia] = useState([
    {
      images: [],
      videos: [],
    },
  ])

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async (values) => {
    const payload = {
      attachment: JSON.stringify({
        ...values,
        attachment: media,
      }),
      media_id: router?.query?.id,
    }

    const response = await useMutate({
      prefixUrl: `/${router?.query?.slug}-item/${isOpen?.id}`,
      method: 'PATCH',
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

  const HandleChangeUpload = (event, key) => {
    if (event?.file?.status === 'removed') {
      setMedia((prevData) =>
        prevData?.map((image, i) =>
          i === key ? { ...image, videos: event?.fileList } : image,
        ),
      )
    }
  }

  const HandleChangeVideoUpload = (event, key) => {
    if (event?.file?.status === 'removed') {
      setMedia((prevData) =>
        prevData?.map((video, i) =>
          i === key ? { ...video, videos: event?.fileList } : video,
        ),
      )
    }
  }

  const HandleBeforeUpload = async (file, key) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await useUpload({
      prefixUrl: `/upload-image`,
      isFormData: true,
      payload: formData,
    })

    if (response?.success) {
      const arrItem = media?.[key]?.images
      arrItem.push({
        uid: arrItem.length + 1,
        name: `${getFilename({ file: response?.data?.image })}`,
        status: 'done',
        url: `${response?.data?.image}`,
      })
      setMedia((prevData) =>
        prevData?.map((image, i) =>
          i === key ? { ...image, images: arrItem } : image,
        ),
      )
    } else {
      const arrItem = media?.[key]?.images
      arrItem.push({
        uid: arrItem.length + 1,
        name: 'image.png',
        status: 'error',
      })
      setMedia((prevData) =>
        prevData?.map((image, i) =>
          i === key ? { ...image, images: arrItem } : image,
        ),
      )
    }
  }

  const HandleBeforeUploadVideo = async (file, key) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await useUpload({
      prefixUrl: `/upload-image`,
      isFormData: true,
      payload: formData,
    })
    if (response?.success) {
      const arrItem = media?.[key]?.videos
      arrItem.push({
        uid: arrItem.length + 1,
        name: `${getFilename({ file: response?.data?.image })}`,
        status: 'done',
        url: `${response?.data?.image}`,
      })
      setMedia((prevData) =>
        prevData?.map((video, i) =>
          i === key ? { ...video, videos: arrItem } : video,
        ),
      )
    } else {
      const arrItem = media?.[key]?.videos
      arrItem.push({
        uid: arrItem.length + 1,
        name: 'image.png',
        status: 'error',
      })
      setMedia((prevData) =>
        prevData?.map((video, i) =>
          i === key ? { ...video, videos: arrItem } : video,
        ),
      )
    }
  }

  const initialValues = {
    media: [{ title: '', caption: '' }],
  }

  useEffect(() => {
    if (!!isOpen) {
      if (isOpen?.attachment) {
        const initialData = JSON.parse(isOpen?.attachment)
        form.setFieldsValue(initialData)
        setMedia(initialData?.attachment)
      }
    }
  }, [isOpen, form])

  return (
    <Drawer
      title={isOpen?.isViewOnly ? 'View' : 'Add'}
      width={900}
      placement="right"
      onClose={showConfirmClose}
      open={isOpen}
      extra={
        <Space hidden={!!isOpen?.isViewOnly}>
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
        initialValues={initialValues}
        autoComplete="off"
        onFinish={onFinish}
        labelAlign="left"
        onValuesChange={(value) => setEditing(!!value)}
      >
        <Form.List name="media">
          {(fields, { add, remove }) => (
            <>
              {fields?.map(({ key, name, ...restField }) => (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider
                        orientation="left"
                        style={{
                          borderColor: COLOR.PRIMARY,
                        }}
                      >
                        {`Media ${name + 1}`}
                      </Divider>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={22}>
                      <Row gutter={[16, 16]}>
                        <Col span={14}>
                          <Form.Item
                            {...restField}
                            label="Title"
                            name={[name, 'title']}
                            rules={[
                              {
                                required: true,
                                message: 'Title is required',
                              },
                            ]}
                          >
                            <Input.TextArea
                              size="large"
                              placeholder="Title ..."
                              disabled={!!isOpen?.isViewOnly}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            label="Attachment Image"
                            name="attachment_images"
                          >
                            <UploadImage
                              fileList={media?.[name]?.images ?? []}
                              onChange={(event) =>
                                HandleChangeUpload(event, name)
                              }
                              onBeforeUpload={(event) =>
                                HandleBeforeUpload(event, name)
                              }
                              maxLength={20}
                              disabled={!!isOpen?.isViewOnly}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={14}>
                          <Form.Item
                            {...restField}
                            label="Caption"
                            name={[name, 'caption']}
                            rules={[
                              {
                                required: true,
                                message: 'Caption is required',
                              },
                            ]}
                          >
                            <Input.TextArea
                              rows={3}
                              size="large"
                              placeholder="Caption ..."
                              disabled={!!isOpen?.isViewOnly}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            label="Attachment Video"
                            name="attachment_videos"
                          >
                            <UploadImage
                              fileList={media?.[name]?.videos ?? []}
                              onChange={(event) =>
                                HandleChangeVideoUpload(event, name)
                              }
                              onBeforeUpload={(event) =>
                                HandleBeforeUploadVideo(event, name)
                              }
                              maxLength={20}
                              type="text"
                              disabled={!!isOpen?.isViewOnly}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={2}>
                      <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        size="large"
                        onClick={() => {
                          remove(name)
                          setMedia(
                            media?.filter(
                              (item, idx) => idx !== name,
                            ),
                          )
                        }}
                        hidden={!!isOpen?.isViewOnly}
                      />
                    </Col>
                  </Row>
                </>
              ))}
              <Row gutter={[16, 16]}>
                <Col>
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add()
                        setMedia([
                          ...media,
                          { images: [], videos: [] },
                        ])
                      }}
                      icon={<PlusOutlined />}
                      size="large"
                      hidden={!!isOpen?.isViewOnly}
                    >
                      Add Row
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form.List>
        <Form.Item hidden>
          <Button ref={refButton} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
