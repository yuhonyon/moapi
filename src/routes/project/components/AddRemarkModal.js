import { Modal,Form, Input,Select } from 'antd';
import React from 'react'
const FormItem=Form.Item;
const TextArea=Input.TextArea
const Option=Select.Option;

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

class AddRemarkModal extends React.Component {

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
        <Modal
          width={640}
          title="添加备注"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="版本"
            >
              {getFieldDecorator('version', {
                initialValue: '1.7',
                rules: [{
                  required: true, message: '必填',
                }],
              })(
                <Select >
                  <Option value="1.7">v1.7</Option>
                  <Option value="1.6">1.6</Option>
                </Select>
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
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

export default Form.create()(AddRemarkModal);
