/* eslint-disable react-hooks/rules-of-hooks */
import RoleComponentRender from '@/components/role-component-render'
import { getFilename } from '@/helpers/utils'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import { CloseOutlined, ExclamationCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Space, notification } from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

const UploadImage = dynamic(() => import('@/components/upload-image'))

export default function EditChild({ isMobile, onClose, isOpen }) {
  const router = useRouter()
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const { useMutate: useUpload } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async () => {
    const payload = {
      public_information_id: router?.query?.id,
      attachment: JSON.stringify(fileList),
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

  const showConfirmReject = (params) => {
    Modal.confirm({
      title: 'Reject Confirm',
      content: <p>Are you sure ?</p>,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const response = await useMutate({
          prefixUrl: `/${router?.query?.slug}-item/${params?.id}`,
          method: 'DELETE',
        })
        if (response?.success) {
          onClose()
          form.resetFields()
        }
      },
      onCancel: () => {},
    })
  }

  const showConfirmClose = () => {
    onClose()
    form.resetFields()
  }

  const HandleChangeUpload = (event) => {
    if (event?.file?.status === 'removed') {
      setFileList(event?.fileList)
    }
  }

  const HandleBeforeUpload = async (file) => {
    if (file.size <= 500000) {
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
    } else {
      notification.warning({
        message: 'Warning',
        description: 'File size more than 500 Kilobytes',
        duration: 2,
        placement: 'topRight',
      })
    }
  }

  useEffect(() => {
    if (!!isOpen) {
      if (isOpen?.attachment) {
        setFileList(JSON.parse(isOpen?.attachment))
      }
    }
  }, [isOpen, form])

  return (
    <Drawer
      title={isOpen?.isViewOnly ? 'View' : 'Edit'}
      width={isMobile ? '100%' : 600}
      placement={isMobile ? 'bottom' : 'right'}
      onClose={showConfirmClose}
      open={isOpen}
      extra={
        <Space>
          <RoleComponentRender condition={!!isOpen?.is_creator}>
            <Button
              danger
              type="primary"
              icon={<CloseOutlined />}
              onClick={() => showConfirmReject(item)}
            >
              Reject
            </Button>
          </RoleComponentRender>
          <Button
            onClick={showConfirmClose}
            icon={<CloseOutlined />}
            disabled={isLoadingSubmit}
            hidden={!!isOpen?.isViewOnly}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSubmitClick()}
            icon={<SaveOutlined />}
            type="primary"
            loading={isLoadingSubmit}
            hidden={!!isOpen?.isViewOnly}
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
      >
        <Form.Item label="Attachment/surat" name="attachment">
          <UploadImage
            fileList={fileList}
            onChange={HandleChangeUpload}
            onBeforeUpload={HandleBeforeUpload}
            maxLength={1}
            disabled={!!isOpen?.isViewOnly}
            type="text"
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
