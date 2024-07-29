/* eslint-disable react-hooks/rules-of-hooks */
import { MEDIA_TYPE_VALUE } from '@/constants'
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
  Space,
  Typography,
} from 'antd'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

export default function AddChild({ isMobile, onClose, isOpenAdd }) {
  const router = useRouter()
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [media, setMedia] = useState({
    cetak: [{link: '', value: 0}],
    online: [{link: '', value: 0}],
    tv: [{link: '', value: 0}],
    yt: [{link: '', value: 0}],
  })

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async () => {
    const payload = {
      scoring_id: router?.query?.id,
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

  const handleAddRowMedia = ({ type }) => {
    const item = media?.[type]
    item.push({ link: '', value: 0 })
    setMedia({ ...media, [type]: item })
  }

  const handleChangeValue = ({ type, index, value }) => {
    const arrItem = media?.[type]
    const updateChange = arrItem?.map((item, idx) =>
      idx === index
        ? {
            ...item,
            link: value,
            value: value ? MEDIA_TYPE_VALUE?.[type] : 0,
          }
        : item,
    )
    setMedia({ ...media, [type]: updateChange })
  }

  const handleDeleteRowMedia = ({ type, index }) => {
    const arrItem = media?.[type]
    const updateChange = arrItem?.filter((item, idx) => idx !== index)
    setMedia({ ...media, [type]: updateChange })
  }

  const countMediaType = ({ type }) => {
    if (media?.[type]?.length === 0) return 0
    return media?.[type]?.reduce((sum, item) => sum + item.value, 0)
  }

  return (
    <Drawer
      title={isMobile ? false : 'Add'}
      width={isMobile ? '100%' : 1000}
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
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <Row>
              <Col span={24}>
                <Form.Item label="Media Online">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Typography.Paragraph
                        style={{ textAlign: 'center' }}
                      >
                        {countMediaType({ type: 'online' })}
                      </Typography.Paragraph>
                    </Col>
                    {media?.online?.map((item, idx) => (
                      <Col key={idx} span={24}>
                        <Space.Compact>
                          <Input
                            value={item?.link}
                            placeholder="Link ..."
                            size="large"
                            onChange={(e) =>
                              handleChangeValue({
                                type: 'online',
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
                                type: 'online',
                                index: idx,
                              })
                            }
                          />
                        </Space.Compact>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Button
                  icon={<PlusOutlined />}
                  style={{ width: '50px' }}
                  type="default"
                  onClick={() =>
                    handleAddRowMedia({ type: 'online' })
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={24}>
                <Form.Item label="Media Cetak">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Typography.Paragraph
                        style={{ textAlign: 'center' }}
                      >
                        {countMediaType({ type: 'cetak' })}
                      </Typography.Paragraph>
                    </Col>
                    {media?.cetak?.map((item, idx) => (
                      <Col key={idx} span={24}>
                        <Space.Compact>
                          <Input
                            value={item?.link}
                            placeholder="Link ..."
                            size="large"
                            onChange={(e) =>
                              handleChangeValue({
                                type: 'cetak',
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
                                type: 'cetak',
                                index: idx,
                              })
                            }
                          />
                        </Space.Compact>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Button
                  icon={<PlusOutlined />}
                  style={{ width: '50px' }}
                  type="default"
                  onClick={() => handleAddRowMedia({ type: 'cetak' })}
                />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={24}>
                <Form.Item label="Media Televisi">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Typography.Paragraph
                        style={{ textAlign: 'center' }}
                      >
                        {countMediaType({ type: 'tv' })}
                      </Typography.Paragraph>
                    </Col>
                    {media?.tv?.map((item, idx) => (
                      <Col key={idx} span={24}>
                        <Space.Compact>
                          <Input
                            value={item?.link}
                            placeholder="Link ..."
                            size="large"
                            onChange={(e) =>
                              handleChangeValue({
                                type: 'tv',
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
                                type: 'tv',
                                index: idx,
                              })
                            }
                          />
                        </Space.Compact>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Button
                  icon={<PlusOutlined />}
                  style={{ width: '50px' }}
                  type="default"
                  onClick={() => handleAddRowMedia({ type: 'tv' })}
                />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={24}>
                <Form.Item label="Media Youtube">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Typography.Paragraph
                        style={{ textAlign: 'center' }}
                      >
                        {countMediaType({ type: 'yt' })}
                      </Typography.Paragraph>
                    </Col>
                    {media?.yt?.map((item, idx) => (
                      <Col key={idx} span={24}>
                        <Space.Compact>
                          <Input
                            value={item?.link}
                            placeholder="Link ..."
                            size="large"
                            onChange={(e) =>
                              handleChangeValue({
                                type: 'yt',
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
                                type: 'yt',
                                index: idx,
                              })
                            }
                          />
                        </Space.Compact>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Button
                  icon={<PlusOutlined />}
                  style={{ width: '50px' }}
                  type="default"
                  onClick={() => handleAddRowMedia({ type: 'yt' })}
                />
              </Col>
            </Row>
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
