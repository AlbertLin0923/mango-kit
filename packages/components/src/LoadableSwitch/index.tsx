import { useState } from 'react'
import { Switch } from 'antd'

import type { SwitchProps } from 'antd'

export type LoadableSwitchProps = Omit<SwitchProps, 'loading'>

const LoadableSwitch: FC<LoadableSwitchProps> = ({
  onChange,
  ...restProps
}) => {
  const [loading, setLoading] = useState(false)

  return (
    <Switch
      {...restProps}
      loading={loading}
      onChange={async (checked, event) => {
        setLoading(true)
        try {
          onChange && (await onChange(checked, event))
        } catch (err) {
          console.error(err)
        }
        setLoading(false)
      }}
    />
  )
}

export default LoadableSwitch
