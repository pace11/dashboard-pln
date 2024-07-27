/* eslint-disable react-hooks/rules-of-hooks */
import { mappingOptionRelease } from '@/helpers/utils'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from 'antd'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

export default function AddChild({ isMobile, onClose, isOpenAdd }) {
  const router = useRouter()
  const { data: listRelease, isLoading: isLoadingOption } =
    useQueriesMutation({
      prefixUrl: '/posts/release',
    })
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [media, setMedia] = useState([])

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async () => {
    const payload = {
      news_id: router?.query?.id,
      attachment: JSON.stringify(media),
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
    onClose()
    form.resetFields()
  }

  const handleAddRowMedia = () => {
    setMedia((oldArray) => [
      ...oldArray,
      { link: '', number_release: '' },
    ])
  }

  const handleChangeValue = ({ index, key, value }) => {
    const arrItem = [...media]
    const updateChange = arrItem?.map((item, idx) =>
      idx === index
        ? {
            ...item,
            [key]: value ?? '',
          }
        : item,
    )
    setMedia(updateChange)
  }

  const handleDeleteRowMedia = ({ index }) => {
    const arrItem = [...media]
    const updateChange = arrItem?.filter((item, idx) => idx !== index)
    setMedia(updateChange)
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
      >
        <Row>
          <Col span={24}>
            <Form.Item label="Berita">
              <Row gutter={[16, 16]}>
                {media?.map((item, idx) => (
                  <>
                    <Col span={10}>
                      <Select
                        allowClear
                        showSearch
                        loading={isLoadingOption}
                        options={mappingOptionRelease({
                          data: listRelease?.data,
                        })}
                        size="large"
                        onChange={(value) =>
                          handleChangeValue({
                            key: 'number_release',
                            index: idx,
                            value: value,
                          })
                        }
                      />
                    </Col>
                    <Col key={idx} span={14}>
                      <Space.Compact style={{ width: '100%' }}>
                        <Input
                          value={item?.link}
                          placeholder="Link ..."
                          size="large"
                          onChange={(e) =>
                            handleChangeValue({
                              key: 'link',
                              index: idx,
                              value: e.target.value,
                            })
                          }
                        />
                        <Button
                          danger
                          type="primary"
                          icon={<DeleteOutlined />}
                          size="large"
                          onClick={() =>
                            handleDeleteRowMedia({
                              index: idx,
                            })
                          }
                        />
                      </Space.Compact>
                    </Col>
                  </>
                ))}
              </Row>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button
              icon={<PlusOutlined />}
              style={{ width: '50px' }}
              type="default"
              onClick={() => handleAddRowMedia()}
            />
          </Col>
        </Row>
        <Form.Item hidden>
          <Button ref={refButton} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
