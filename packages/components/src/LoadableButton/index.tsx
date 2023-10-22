import { useState } from 'react'
import { Button } from 'antd'

import type { ButtonProps } from 'antd'

export type LoadableButtonProps = Omit<ButtonProps, 'loading'>

const LoadableButton: FC<LoadableButtonProps> = ({ onClick, ...restProps }) => {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      {...restProps}
      loading={loading}
      onClick={async (event: any) => {
        setLoading(true)
        try {
          onClick && (await onClick(event))
        } catch (err) {
          console.error(err)
        }
        setLoading(false)
      }}
    />
  )
}

export default LoadableButton
