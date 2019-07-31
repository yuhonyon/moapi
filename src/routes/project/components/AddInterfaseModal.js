import { Modal, Form, Input, Select } from 'antd'
import React from 'react'
import { inject, observer } from 'mobx-react'
import config from '../../../config/'
const Option = Select.Option
const FormItem = Form.Item
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
}

@inject('project')
@observer
class AddInterfaseModal extends React.Component {
  handleOk = e => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      this.props.onOk(values)
      this.props.form.resetFields()
      this.props.onClose()
    })
  }
  handleCancel = e => {
    this.props.form.resetFields()
    this.props.onClose()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Modal
          maskClosable={false}
          width={640}
          title="添加接口"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '必填'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="URL">
              {getFieldDecorator('url', {
                rules: [
                  {
                    required: true,
                    message: '必填'
                  },
                  {
                    validator: (rule, value, callback) => {
                      let method = this.props.form.getFieldValue('method')
                      if (value && method) {
                        for (let module of this.props.project.modules) {
                          if (
                            module.interfases.find(
                              interfase =>
                                interfase.url === value &&
                                interfase.method === method
                            )
                          ) {
                            callback(new Error('url已被占用'))
                          }
                        }
                      }
                      callback()
                    }
                  }
                ]
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="类型">
              {getFieldDecorator('method', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必选'
                  }
                ]
              })(
                <Select
                  onChange={() => {
                    setTimeout(
                      () =>
                        this.props.form.validateFields(['url'], {
                          force: true
                        }),
                      0
                    )
                  }}
                >
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="DELETE">DELETE</Option>
                  <Option value="PUT">PUT</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="标记版本">
              {getFieldDecorator('versions', {
                initialValue:
                  this.props.project.curVersion ||
                  this.props.project.info.version,
                rules: [
                  {
                    required: true,
                    message: '必选'
                  }
                ]
              })(
                <Select mode="multiple">
                  {this.props.project.info.versions.slice().map(version => (
                    <Option value={version} key={version}>
                      {version}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            {!this.props.project.info.useGlobalProxy && (
              <FormItem {...formItemLayout} label="代理地址">
                {getFieldDecorator('proxyUrl', {
                  initialValue: ''
                })(
                  <Select>
                    <Option key="DEFAUT" value={''}>
                      使用全局代理地址
                    </Option>
                    {this.props.project.info.proxys.map(item => (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}

            <FormItem {...formItemLayout} label="简介">
              {getFieldDecorator('description', {
                initialValue: ''
              })(<TextArea />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(AddInterfaseModal)
