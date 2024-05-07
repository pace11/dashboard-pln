import { PlusOutlined } from '@ant-design/icons'
import { Button, Image, Upload } from 'antd'
import { useState } from 'react'

const UploadImage = ({
  fileList,
  onChange,
  onBeforeUpload,
  isLoading,
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
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={onChange}
        beforeUpload={onBeforeUpload}
      >
        {fileList.length >= 1 ? null : (
          <Button
            type="button"
            icon={<PlusOutlined />}
            loading={isLoading}
          />
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
