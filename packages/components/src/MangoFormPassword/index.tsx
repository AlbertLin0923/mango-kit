import { useState } from 'react'
import { Form, Input, Progress, Popover } from 'antd'

const isPassword = (string: string): boolean => {
  return /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,20}$/.test(string)
}

const isPasswordStrongly = (
  string: string,
): 'success' | 'normal' | 'exception' => {
  if (/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\da-zA-Z\s]).{8,20}$/.test(string)) {
    return 'success'
  } else if (
    /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,20}$/.test(string)
  ) {
    return 'normal'
  } else {
    return 'exception'
  }
}

export type MangoFormPasswordProps = {
  widthLabel?: boolean
  label?: string
}

export const MangoFormPassword: FC<MangoFormPasswordProps> = ({
  widthLabel = false,
  label,
}) => {
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false)
  const passwordStrengthMap = {
    success: {
      text: '强',
      percent: 100,
    },
    normal: {
      text: '中',
      percent: 70,
    },
    exception: {
      text: '弱',
      percent: 30,
    },
  }

  return (
    <>
      <Popover
        content={
          <Form.Item
            shouldUpdate={(prevValues, curValues) =>
              prevValues?.['password'] !== curValues?.['password']
            }
            noStyle
          >
            {(form) => {
              const { password } = form.getFieldsValue(['password'])
              const passwordStrengthStatus = isPasswordStrongly(password)

              return (
                popoverVisible && (
                  <div style={{ padding: '5px 10px' }}>
                    <div>
                      <span>强度：</span>
                      <span>
                        {passwordStrengthMap[passwordStrengthStatus]['text']}
                      </span>
                    </div>
                    <Progress
                      percent={
                        passwordStrengthMap[passwordStrengthStatus]['percent']
                      }
                      showInfo={false}
                      status={passwordStrengthStatus}
                    />
                    <div style={{ marginTop: 10 }}>
                      <span>
                        请输入 8-20 位密码，必须包含字母、数字、符号中至少2种
                      </span>
                    </div>
                  </div>
                )
              )
            }}
          </Form.Item>
        }
        open={popoverVisible}
        placement="top"
      >
        <Form.Item
          label={widthLabel ? label || '密码' : null}
          name="password"
          normalize={(value: any) => {
            return value.trim()
          }}
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
            {
              min: 8,
              message: '密码最小长度为8',
            },
            {
              max: 20,
              message: '密码最大长度为20',
            },
            () => ({
              validator(_, value) {
                if (!value) {
                  setPopoverVisible(false)
                  return Promise.resolve()
                } else {
                  setPopoverVisible(true)
                  if (!isPassword(value)) {
                    return Promise.reject(
                      new Error(
                        '请输入 8-20 位密码，必须包含字母、数字、符号中至少2种',
                      ),
                    )
                  } else {
                    return Promise.resolve()
                  }
                }
              },
            }),
          ]}
        >
          <Input.Password
            maxLength={20}
            placeholder="请输入密码"
            allowClear
            onBlur={() => {
              setPopoverVisible(false)
            }}
          />
        </Form.Item>
      </Popover>
      <Form.Item
        dependencies={['password']}
        name="repeatPassword"
        normalize={(value: any) => {
          return value.trim()
        }}
        rules={[
          {
            required: true,
            message: '请再次输入密码',
          },
          {
            min: 8,
            message: '密码最小长度为8',
          },
          {
            max: 20,
            message: '密码最大长度为20',
          },
          (_form) => ({
            validator(_, value) {
              if (!value || _form.getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('两次输入密码不匹配'))
            },
          }),
        ]}
      >
        <Input.Password maxLength={20} placeholder="请再次输入密码" />
      </Form.Item>
    </>
  )
}
