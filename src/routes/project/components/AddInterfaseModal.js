import { Modal, Form, Input, Select, Button,message } from 'antd'
import React from 'react'
import { inject, observer } from 'mobx-react'
import config from '../../../config/'
import fetchApi from '../../../api'
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
  state={interfaseList:[],relevance:false}
  relevanceInterfaseId=null;
  handleOk = e => {
    if(this.state.relevance){
      if(!this.relevanceInterfaseId){
        message.info('请选择被关联的接口')
        return;
      }
      let info={relevanceInterfaseId:this.relevanceInterfaseId}
      this.props.onOk(info)
      this.props.form.resetFields()
      this.props.onClose()
      return;
    }
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

  
  handleSearchInterfase = text => {
    clearTimeout(this.timer)
    this.timer=setTimeout(() => {
      fetchApi.fetchSearchInterfase(text).then(data => {
        this.setState({ interfaseList: data })
      })
    }, 300);
  }

  handleRelevance=()=>{
    this.setState({relevance:!this.state.relevance})
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Modal
          maskClosable={false}
          width={640}
          title={<div>添加接口&emsp;<Button size="small" icon='link' onClick={this.handleRelevance}>{this.state.relevance?'新增普通接口':'新增关联老接口'}</Button></div>}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this.state.relevance?
         <Form>
            <FormItem  {...formItemLayout}  label="被关联接口">
                  <Select
                showSearch
                style={{ width: 300 }}
                placeholder="输入url或者接口名称查找接口"
                onChange={(e, option) => {
                  this.relevanceInterfaseId=option.props.interfaseid;
                }}
                onSearch={this.handleSearchInterfase}
                filterOption={(input, option) => {
                  return (
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0 ||
                    option.props.value
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  )
                }}
              >
                {this.state.interfaseList.map(item => (
                  <Option
                    moduleid={item.moduleId}
                    interfaseid={item.id}
                    projectid={item.projectId}
                    key={item.id}
                    value={item.url + item.id}
                  >
                    {item.project.name+'>'+item.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Form>
          :<Form>
            
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
          }
        </Modal>
      </div>
    )
  }
}

export default Form.create()(AddInterfaseModal)
