import { LoadableButton } from '@mango-kit/components'
import { sleep } from '@mango-kit/utils'
import '@mango-kit/components/styles'

const Demo: FC = () => {
  return (
    <LoadableButton
      type="primary"
      onClick={async () => {
        await sleep(3000)
        return Promise.resolve(true)
      }}
    >
      按钮
    </LoadableButton>
  )
}

export default Demo
