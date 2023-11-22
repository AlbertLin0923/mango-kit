import { MangoFormPassword } from '@mango-kit/components'
import '@mango-kit/components/styles'
import { Form } from 'antd'

const Demo: FC = () => {
  const [form] = Form.useForm()

  return (
    <Form
      form={form}
      onFinish={(v) => {
        console.log(v)
      }}
    >
      <MangoFormPassword
        label={['新密码', '确认密码']}
        popoverProps={{ placement: 'top' }}
        widthLabel
      />
    </Form>
  )
}

export default Demo
