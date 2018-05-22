import { Modal,Form, Input } from 'antd';
import React from 'react'

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

class EditModuleModal extends React.Component {

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
        name: nextProps.module.name,
        description: nextProps.module.description
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          width={640}
          title="编辑模块"
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

export default Form.create()(EditModuleModal);
