import { LoadableSwitch } from '@mango-kit/components'
import { sleep } from '@mango-kit/utils'
import '@mango-kit/components/styles'

const Demo: FC = () => {
  return (
    <LoadableSwitch
      onChange={async () => {
        await sleep(3000)
        return Promise.resolve(true)
      }}
    >
      LoadableSwitch
    </LoadableSwitch>
  )
}

export default Demo
