import React from "react";
import { Form, Icon, Input, Button, message } from 'antd';
import Style from "./LoginForm.less";
import {inject, observer} from 'mobx-react';
import {withRouter} from "react-router-dom";
import intl from "react-intl-universal";
const FormItem = Form.Item;

@inject("user")
@observer
class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.user.signup(values).then(()=>{
          message.success(intl.get("login.message.signup").d("注册成功"));
          this.props.history.push("/project")
        })
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.wrapper}>
        <Form onSubmit={this.handleSubmit} className={Style.from}>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: intl.get("login.rules.name").d("请输入用户名") }],
            })(
              <Input  size="large"  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder={intl.get("login.placeholder.name").d("用户名")} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: intl.get("login.rules.phone").d("请输入手机号") }],
            })(
              <Input size="large"  prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={intl.get("login.placeholder.phone").d("手机号")} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: intl.get("login.rules.password").d("请输入密码") }],
            })(
              <Input  size="large"  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={intl.get("login.placeholder.password").d("密码")} />
            )}
          </FormItem>
          <FormItem>
            <Button style={{width:"100%"}} size="large"  type="primary" htmlType="submit" className={Style.submit}>
              {intl.get("login.signup").d("注册")}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(LoginForm);

export default withRouter(WrappedNormalLoginForm);
