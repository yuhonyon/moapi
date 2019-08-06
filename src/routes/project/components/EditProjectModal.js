import {
  Modal,
  message,
  Form,
  Icon,
  Button,
  Input,
  Select,
  Radio,
  Switch
} from 'antd'
import React from 'react'
import { inject, observer } from 'mobx-react'
import config from '../../../config'
import { getFileItem } from 'antd/lib/upload/utils'

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
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 12, offset: 5 }
  }
}

let id
@inject('user')
@inject('project')
@observer
class EditProjectModal extends React.Component {
  componentDidMount() {
    if (this.props.user.userList.length === 0) {
      this.props.user.getUserList()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.props.form.setFieldsValue({
        name: this.props.project.info.name,
        mockType: this.props.project.info.mockType,
        admin: this.props.project.info.admin.id,
        developers: this.props.project.info.developers
          .toJS()
          .map(item => item.id),
        guests: this.props.project.info.guests.toJS().map(item => item.id),
        reporters: this.props.project.info.reporters
          .toJS()
          .map(item => item.id),
        proxy: this.props.project.info.proxy,
        proxys: this.props.project.info.proxys.toJS(),
        keys: this.props.project.info.proxys.map((i, index) => index),
        public: this.props.project.info.public,
        visible: this.props.project.info.visible,
        description: this.props.project.info.description,
        useGlobalProxy: this.props.project.info.useGlobalProxy
      })
      id = this.props.project.info.proxys.length
    }
  }

  handleOk = e => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      values.proxy = values.proxys[values.proxyKey]
      values.proxys = values.proxys.filter(i => !!i)

      delete values.keys
      delete values.proxyKey
      this.props.onOk(values)
      this.props.form.resetFields()
      this.props.onClose()
    })
  }
  handleCancel = e => {
    this.props.form.resetFields()
    this.props.onClose()
  }

  remove = k => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const proxyKey = form.getFieldValue('proxyKey')
    if (k === proxyKey) {
      message.error('不能删除被选中的代理地址')
      return
    }
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }

  add = () => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextkeys = keys.concat(id++)
    form.setFieldsValue({
      keys: nextkeys
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form

    getFieldDecorator('keys', {
      initialValue: []
    })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => (
      <FormItem
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '代理地址池' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`proxys[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          initialValue: this.props.project.info.proxys[k],
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请填写或者删除该表单'
            }
          ]
        })(
          <Input
            placeholder="请输入代理地址"
            style={{ width: '90%', marginRight: 8 }}
          />
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </FormItem>
    ))

    return (
      <div>
        <Modal
          maskClosable={false}
          width={640}
          title="编辑项目"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem {...formItemLayout} label="项目名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '必填'
                  }
                ]
              })(<Input disabled={this.props.project.info.permission < 3} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="管理员">
              {getFieldDecorator('admin', {
                initialValue: ''
              })(
                <Select
                  disabled={this.props.project.info.permission < 4}
                  showSearch
                  optionFilterProp=""
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.props.user.userList.map(user => (
                    <Option key={user.id} value={user.id}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="无权限管理">
              {getFieldDecorator('public', {
                initialValue: false,
                valuePropName: 'checked'
              })(<Switch disabled={this.props.project.info.permission < 3} />)}
            </FormItem>

            {!this.props.form.getFieldValue('public') && (
              <FormItem {...formItemLayout} label="所有人可见">
                {getFieldDecorator('visible', {
                  initialValue: false,
                  valuePropName: 'checked'
                })(
                  <Switch disabled={this.props.project.info.permission < 3} />
                )}
              </FormItem>
            )}

            {!this.props.form.getFieldValue('public') && (
              <div>
                <FormItem {...formItemLayout} label="开发者">
                  {getFieldDecorator('developers', {
                    initialValue: []
                  })(
                    <Select
                      showSearch
                      disabled={this.props.project.info.permission < 3}
                      mode="multiple"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.props.user.userList.map(user => (
                        <Option key={user.id} value={user.id}>
                          {user.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="使用者">
                  {getFieldDecorator('reporters', {
                    initialValue: []
                  })(
                    <Select
                      showSearch
                      disabled={this.props.project.info.permission < 2}
                      mode="multiple"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.props.user.userList.map(user => (
                        <Option key={user.id} value={user.id}>
                          {user.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="游客">
                  {getFieldDecorator('guests', {
                    initialValue: []
                  })(
                    <Select
                      showSearch
                      disabled={this.props.project.info.permission < 2}
                      mode="multiple"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.props.user.userList.map(user => (
                        <Option key={user.id} value={user.id}>
                          {user.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
            )}

            <FormItem {...formItemLayout} label="全局mock">
              {getFieldDecorator('mockType', {
                initialValue: 1,
                valuePropName: 'checked'
              })(
                <Radio.Group
                  defaultValue={this.props.project.info.mockType}
                  buttonStyle="solid"
                  disabled={this.props.project.info.permission < 2}
                >
                  <Radio.Button value={1}>默认</Radio.Button>
                  <Radio.Button value={0}>全局关闭</Radio.Button>
                  <Radio.Button value={2}>全局开启</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="代理地址">
              {getFieldDecorator('proxyKey', {
                initialValue: this.props.project.info.proxys.findIndex(
                  item => item === this.props.project.info.proxy
                )
              })(
                <Select>
                  {this.props.form
                    .getFieldValue('keys')
                    .map(id => {
                      return {
                        id,
                        value: this.props.form.getFieldValue('proxys')[id]
                      }
                    })
                    .map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.value}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="全局使用代理地址">
              {getFieldDecorator('useGlobalProxy', {
                initialValue: true,
                valuePropName: 'checked'
              })(<Switch />)}
            </FormItem>

            {formItems}

            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> 添加代理地址
              </Button>
            </FormItem>

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

export default Form.create()(EditProjectModal)
