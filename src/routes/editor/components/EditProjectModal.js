import { Modal,Form, Input, Select,Switch } from 'antd';
import React from 'react'
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

class EditProjectModal extends React.Component {

  handleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      values.key=""+Date.now()+values.name;
      values.required=true;
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
        <Modal
          width={640}
          title="编辑项目"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="项目名称"
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
              label="拥有者"
            >
              {getFieldDecorator('type', {
                initialValue: 'String'
              })(
                <Select>
                  <Option value="String">String</Option>
                  <Option value="Number">Number</Option>
                  <Option value="Array">Array</Option>
                  <Option value="Object">Object</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="成员"
            >
              {getFieldDecorator('mockType', {
                initialValue: 'String'
              })(
                <Select>
                  <Option value="String">String</Option>
                  <Option value="Number">Number</Option>
                  <Option value="Array">Array</Option>
                  <Option value="Object">Object</Option>
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="代理地址"
            >
              {getFieldDecorator('proxy', {
                initialValue: ''
              })(
                <Input />
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

export default Form.create()(EditProjectModal);
