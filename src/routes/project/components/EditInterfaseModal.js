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
class EditInterfaseModal extends React.Component {

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



  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.props.form.setFieldsValue({
        name: nextProps.interfase.name,
        url: nextProps.interfase.url,
        method: nextProps.interfase.method,
        description: nextProps.interfase.description,
        versions:nextProps.interfase.versions,
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title="编辑接口"
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
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              {getFieldDecorator('method', {
                initialValue: 'GET',
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

export default Form.create()(EditInterfaseModal);
