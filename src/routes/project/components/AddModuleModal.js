import { Modal,Form, Input } from 'antd';
import React from 'react'
import intl from "react-intl-universal";
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

class AddModuleModal extends React.Component {

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
          title={intl.get('project.module.title')}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={intl.get('project.module.name')}
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: intl.get('project.required'),
                }],
              })(
                <Input />
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label={intl.get('project.module.description')}
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

export default Form.create()(AddModuleModal);
