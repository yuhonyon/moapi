import { Modal,Form, Input, Select } from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';
const Option=Select.Option;
const FormItem=Form.Item;
const TextArea=Input.TextArea

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};





@inject("project")
@observer
class AddInterfaseModal extends React.Component {

  handleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      this.props.onOk(values);
      this.props.form.resetFields()
      this.props.onClose();
    });
  }
  handleCancel = (e) => {
    this.props.form.resetFields()
    this.props.onClose();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title="添加接口"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '必填',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="URL"
            >
              {getFieldDecorator('url', {
                rules: [{
                  required: true, message: '必填',
                },{
                  validator:(rule,value,callback)=>{
                    if(value){
                      for(let module of this.props.project.modules){
                        if(module.interfases.find(interfase=>interfase.url===value)){
                          callback(new Error("url已被占用"))
                        }
                      }
                    }
                    callback()
                  }
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="网关URL"
            >
              {getFieldDecorator('gatewayUrl', {
                initialValue: '',
                rules:[
                  {
                    validator:(rule,value,callback)=>{
                      if(!value){
                        callback()
                        return;
                      }
                      for(let module of this.props.project.modules){
                        if(module.interfases.find(interfase=>interfase.gatewayUrl===value)){
                          callback(new Error("url已被占用"))
                          return
                        }
                      }
                      callback()
                    }
                  }
                ]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              {getFieldDecorator('method', {
                initialValue: '',
                rules: [{
                  required: true, message: '必选',
                }],
              })(
                <Select>
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="DELETE">DELETE</Option>
                  <Option value="PUT">PUT</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="标记版本"
            >
              {getFieldDecorator('versions', {
                initialValue: this.props.project.curVersion||this.props.project.info.version,
                rules: [{
                  required: true, message: '必选',
                }],
              })(
                <Select mode="multiple">
                  {
                    this.props.project.info.versions.slice().map(version=>(<Option value={version} key={version}>{version}</Option>))
                  }
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="简介"
            >
              {getFieldDecorator('description', {
                initialValue: ''
              })(
                <TextArea />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(AddInterfaseModal);
