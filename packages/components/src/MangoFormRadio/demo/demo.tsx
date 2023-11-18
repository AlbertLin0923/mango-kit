import { MangoFormRadio } from '@mango-kit/components'
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
      <MangoFormRadio
        initialValue="1"
        label="最喜欢的水果"
        name="fruit"
        options={[
          { label: '芒果', value: '1' },
          { label: '火龙果', value: '2' },
          { label: '苹果', value: '3' },
        ]}
        theme="nav"
      >
        123
      </MangoFormRadio>
    </Form>
  )
}

export default Demo
