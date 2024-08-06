/* eslint-disable react-hooks/rules-of-hooks */
import { COLOR } from '@/constants'
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
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from 'antd'
import { useRouter } from 'next/router'
import { useRef } from 'react'

export default function AddChildBerita({ onClose, isOpenAdd }) {
  const router = useRouter()
  const { data: listRelease, isLoading: isLoadingOption } =
    useQueriesMutation({
      prefixUrl: '/posts/release',
    })
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})
  const refButton = useRef(null)
  const [form] = Form.useForm()

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async (values) => {
    const payload = {
      news_id: router?.query?.id,
      attachment: JSON.stringify(values),
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

  const initialValues = {
    berita: [{ number_release: null, link: '' }],
  }

  return (
    <Drawer
      title="Add"
      width={900}
      placement="right"
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
        name={`form-${router?.query?.slug}`}
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
                        />
                      </Form.Item>
                    </Col>
                    <Col span={14}>
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
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            placeholder="Link ..."
                            size="large"
                          />
                          <Button
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                            size="large"
                            onClick={() => remove(name)}
                          />
                        </Space.Compact>
                      </Form.Item>
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
