/* eslint-disable react-hooks/rules-of-hooks */
import { COLOR } from '@/constants'
import { mappingOptionRelease, validURL } from '@/helpers/utils'
import { useQueriesMutation } from '@/lib/hooks/useQueriesMutation'
import {
  CloseOutlined,
  LinkOutlined,
  MinusCircleOutlined,
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
  Row,
  Select,
  Space,
} from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

export default function EditChildBerita({ onClose, isOpen }) {
  const router = useRouter()
  const { data: listRelease, isLoading: isLoadingOption } =
    useQueriesMutation({
      prefixUrl: '/posts/release',
    })
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useState()

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onValuesChange = (changedValues, allValues) => {
    setFormValues(allValues)
  }

  const onFinish = async (values) => {
    const payload = {
      news_id: router?.query?.id,
      attachment: JSON.stringify(values),
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
    onClose()
    form.resetFields()
  }

  useEffect(() => {
    if (!!isOpen) {
      if (isOpen?.attachment) {
        const initialData = JSON.parse(isOpen?.attachment)
        form.setFieldsValue(initialData)
        setFormValues(initialData)
      }
    }
  }, [isOpen, form])

  return (
    <Drawer
      title={isOpen?.isViewOnly ? 'View' : 'Edit'}
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
        onValuesChange={onValuesChange}
        autoComplete="off"
        onFinish={onFinish}
        labelAlign="left"
      >
        <Form.List name="berita">
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
                        {`Berita ${name + 1}`}
                      </Divider>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]} key={key}>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'number_release']}
                        rules={[
                          {
                            required: true,
                            message: 'Number release is required',
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          showSearch
                          loading={isLoadingOption}
                          options={mappingOptionRelease({
                            data: listRelease?.data,
                          })}
                          placeholder="Please select number release ..."
                          size="large"
                          disabled={isOpen?.isViewOnly}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'link']}
                        rules={[
                          {
                            required: true,
                            message: 'Link is required',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Link ..."
                          size="large"
                          disabled={isOpen?.isViewOnly}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        type="primary"
                        size="large"
                        icon={<LinkOutlined />}
                        onClick={() =>
                          window.open(
                            `${formValues?.berita?.[name]?.link}`,
                            '_blank',
                          )
                        }
                        disabled={
                          !validURL(formValues?.berita?.[name]?.link)
                        }
                      />
                    </Col>
                    <Col span={2}>
                      <Button
                        danger
                        type="primary"
                        icon={<MinusCircleOutlined />}
                        size="large"
                        onClick={() => remove(name)}
                        hidden={isOpen?.isViewOnly}
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
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      size="large"
                      hidden={isOpen?.isViewOnly}
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
