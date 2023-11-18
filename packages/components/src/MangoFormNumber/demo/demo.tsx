import { MangoFormNumber } from '@mango-kit/components'
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
      <MangoFormNumber
        initialValue={1}
        label="购买数量"
        max={100}
        min={1}
        name="quantity"
      />
    </Form>
  )
}

export default Demo
