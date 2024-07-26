import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Image, Upload } from 'antd'
import { useState } from 'react'

const UploadImage = ({
  fileList,
  onChange,
  onBeforeUpload,
  isLoading,
  maxLength = 1,
  disabled = false,
  type = 'picture-card',
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }

  return (
    <>
      <Upload
        listType={type}
        fileList={fileList}
        onPreview={type === 'picture-card' ? handlePreview : false}
        onChange={onChange}
        beforeUpload={onBeforeUpload}
        disabled={disabled}
      >
        {fileList.length >= maxLength ? null : (
          <Button
            type={type === 'picture-card' ? 'button' : 'default'}
            icon={
              type === 'picture-card' ? (
                <PlusOutlined />
              ) : (
                <UploadOutlined />
              )
            }
            loading={isLoading}
            hidden={disabled}
          >
            {`${type === 'picture-card' ? '' : 'Upload file'}`}
          </Button>
        )}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) =>
              !visible && setPreviewImage(''),
          }}
          src={previewImage}
          alt={previewImage}
        />
      )}
    </>
  )
}

export default UploadImage
