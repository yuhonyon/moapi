import { Modal,Form,Select } from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';

const FormItem=Form.Item;
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

@inject("projectList")
@observer
class AddWatchProjectModal extends React.Component {

  componentDidMount(){
    if(this.props.projectList.all.length===0){
      this.props.projectList.getProjectList()
    }
  }

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
          title="添加关注"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="关注项目"
            >
              {getFieldDecorator('projectId', {
                initialValue: '',
                rules: [{
                  required: true, message: '必填',
                }],
              })(
                <Select >
                  {this.props.projectList.all.map(project=>(
                    <Option key={project.id} value={project.id}>{project.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(AddWatchProjectModal);
