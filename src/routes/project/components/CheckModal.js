import { Modal,Form, Input,Radio ,Button,Row,Col} from 'antd';
import React from 'react'
import fetchApi from '../../../api'
import {inject, observer} from 'mobx-react';
const FormItem=Form.Item;



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
class CheckModal extends React.Component {
  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.props.form.setFieldsValue({
        nameKey: nextProps.project.info.checkInfo.nameKey,
        nameValue: nextProps.project.info.checkInfo.nameValue,
        url: nextProps.project.info.checkInfo.url,
        passwordValue:nextProps.project.info.checkInfo.passwordValue,
        passwordKey:nextProps.project.info.checkInfo.passwordKey,
        type: nextProps.project.info.checkInfo.type,
        key: nextProps.project.info.checkInfo.key,
        value:nextProps.project.info.checkInfo.value,
      })
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
  handleLogin=(e)=>{
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      fetchApi.fetchCheckLogin(values).then(data=>{
        this.props.onClose();
      })
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title="mock鉴权"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >

          <Form>


            <FormItem
              {...formItemLayout}
              label="鉴权方式"
            >
              {getFieldDecorator('type', {
                initialValue: this.props.project.info.checkInfo.type,
              })(
                <Radio.Group  buttonStyle="solid" disabled={this.props.project.info.permission<2}>
                  <Radio.Button value={0}>无鉴权</Radio.Button>
                  <Radio.Button value={1}>In Header</Radio.Button>
                  <Radio.Button value={2}>password</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>


            <div style={{display:this.props.form.getFieldsValue(['type']).type===1?'block':'none'}}>
              <FormItem
                {...formItemLayout}
                label="key"
              >
                {getFieldDecorator('key', {
                  initialValue:'token',
                  rules: [{

                  }],
                })(
                  <Input />
                )}
              </FormItem>


              <FormItem
                {...formItemLayout}
                label="value"
              >
                {getFieldDecorator('value', {
                  initialValue: ''
                })(
                  <Input />
                )}
              </FormItem>
            </div>

            <div style={{display:this.props.form.getFieldsValue(['type']).type===2?'block':'none'}}>
              <FormItem
                {...formItemLayout}
                label="Login Url"
              >
                {getFieldDecorator('url', {
                  initialValue:this.props.project.info.proxy+"/login",
                  rules: [{

                  }],
                })(
                  <Input/>
                )}
              </FormItem>


              <FormItem
                {...formItemLayout}
                label="name"
              >
                <Row>
                  <Col span="12">
                    <FormItem

                    >
                      {getFieldDecorator('nameKey', {
                        initialValue:'userName',
                        rules: [{

                        }],
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem

                    >
                      {getFieldDecorator('nameValue', {
                        rules: [{

                        }],
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>


              <FormItem
                {...formItemLayout}
                label="password"
              >
                <Row>
                  <Col span="12">
                    <FormItem

                    >
                      {getFieldDecorator('passwordKey', {
                        initialValue:"password",
                        rules: [{

                        }],
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem

                    >
                      {getFieldDecorator('passwordValue', {
                        rules: [{

                        }],
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>





              <FormItem {...formItemLayout} label="    ">
                <Button type="primary" onClick={this.handleLogin} >登录</Button>
              </FormItem>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(CheckModal);
