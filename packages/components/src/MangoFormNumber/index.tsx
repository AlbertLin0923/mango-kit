import { useState, useEffect } from 'react'
import { Form, Button, InputNumber } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { isNumber } from 'lodash-es'

import type { FormItemProps, InputNumberProps } from 'antd'

export type MangoControlNumberValue = InputNumberProps['value']

export type MangoControlNumberProps = PropsWithChildren<{
  value?: MangoControlNumberValue
  onChange?: (value: MangoControlNumberValue) => void
  beforeChange?: (value: MangoControlNumberValue) => Promise<any>
  containerClassName?: string
  min?: number
  max?: number
  disabled?: boolean
}>

export const MangoControlNumber: FC<MangoControlNumberProps> = (props) => {
  const {
    value,
    onChange,
    beforeChange,
    containerClassName = '',
    min,
    max,
    disabled = false,
  } = props
  const [inputValue, setInputValue] = useState<MangoControlNumberValue>(0)

  const handleChange: InputNumberProps['onChange'] = async (v) => {
    setInputValue(v)
  }

  const handleBlur: InputNumberProps['onBlur'] = async () => {
    let v: any

    if (isNumber(max) && Number(inputValue) > max) {
      v = max
    } else if (isNumber(min) && Number(inputValue) < min) {
      v = min
    } else {
      v = inputValue
    }

    setInputValue(v)
    beforeChange && (await beforeChange(v))

    onChange && onChange(v)
  }

  const handleAdd = () => {
    onChange && onChange(Number(value) + 1)
  }

  const handleDecrease = () => {
    onChange && onChange(Number(value) - 1)
  }

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <div className={cx('mango-number-container', containerClassName)}>
      <Button
        className="btn"
        disabled={value === min || disabled}
        icon={<MinusOutlined />}
        onClick={handleDecrease}
      />
      <InputNumber
        className="mango-number-input"
        controls={false}
        disabled={disabled}
        value={inputValue}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <Button
        className="mango-number-btn"
        disabled={value === max || disabled}
        icon={<PlusOutlined />}
        onClick={handleAdd}
      />
    </div>
  )
}

export type MangoFormNumberProps = MangoControlNumberProps & FormItemProps

export const MangoFormNumber: FC<MangoFormNumberProps> = ({
  onChange,
  beforeChange,
  containerClassName,
  min,
  max,
  ...rest
}) => {
  return (
    <Form.Item {...rest}>
      <MangoControlNumber
        {...{
          onChange,
          beforeChange,
          containerClassName,
          min,
          max,
        }}
      />
    </Form.Item>
  )
}
