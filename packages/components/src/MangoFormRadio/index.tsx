import { useState, useEffect } from 'react'
import { Form, Space } from 'antd'
import cx from 'classnames'

import { SvgIcon } from '../SvgIcon'

import type { MouseEvent } from 'react'
import type { FormItemProps } from 'antd'

type Theme = 'btn' | 'nav' | 'tag'

type MangoControlRadioValue = string | number

type MangoControlRadioItemType = {
  label: string
  value: MangoControlRadioValue
  icon?: ReactNode
  className?: string
  [key: string]: any
}

export type MangoControlRadioProps = PropsWithChildren<{
  options: MangoControlRadioItemType[]
  value?: MangoControlRadioValue
  onChange?: (
    value: MangoControlRadioValue,
    item?: MangoControlRadioItemType,
    e?: MouseEvent<HTMLElement>,
  ) => void
  beforeChange?: (
    value: MangoControlRadioValue,
    item?: MangoControlRadioItemType,
    e?: MouseEvent<HTMLElement>,
  ) => Promise<any>
  containerClassName?: string
  itemClassName?: string
  itemSelectedClassName?: string
  tagClassName?: string
  itemWidth?: number | string
  itemHeight?: number | string
  theme?: Theme
  id?: string
  extraRender?: ReactNode
  extraRawFieldProps?: Record<string, any>
}>

export const MangoControlRadio: FC<MangoControlRadioProps> = ({
  options = [],
  value = '',
  onChange,
  beforeChange,
  containerClassName = '',
  itemClassName = '',
  itemSelectedClassName = '',
  tagClassName = '',
  itemWidth,
  itemHeight,
  theme = 'btn',
  id,
  extraRender,
  extraRawFieldProps,
}) => {
  const [selectedItem, setSelectedItem] = useState<MangoControlRadioItemType>()

  const handleChange: MangoControlRadioProps['onChange'] = async (
    _value,
    item,
    e,
  ) => {
    beforeChange && (await beforeChange(_value, item))
    setSelectedItem(item)
    onChange && onChange(_value, selectedItem, e)
  }

  useEffect(() => {
    const item = options.find((i) => i.value === value)
    setSelectedItem(item)
  }, [value, options])

  return (
    <div
      className={cx(
        'mango-radio-container',
        `mango-radio-${theme}-theme`,
        containerClassName,
      )}
      id={id}
      {...extraRawFieldProps}
    >
      <Space wrap={true}>
        {options.map((i) => {
          const isSelected = i.value === selectedItem?.value
          return (
            <div
              className={cx(
                'mango-radio-item',
                itemClassName,
                i.className,
                isSelected && itemSelectedClassName,
                {
                  'mango-radio-item-selected': isSelected,
                },
              )}
              key={i.value}
              style={{ width: itemWidth, height: itemHeight }}
              onClick={(e: MouseEvent<HTMLElement>) =>
                handleChange(i.value, i, e)
              }
            >
              {theme === 'tag' && isSelected ? (
                <SvgIcon
                  className={cx('mango-radio-item-tag', tagClassName)}
                  iconClass="radio-check"
                />
              ) : null}
              {i.icon ? (
                <div className="mango-radio-item-icon">{i.icon}</div>
              ) : null}
              <div className="mango-radio-item-text">{i.label}</div>
            </div>
          )
        })}
        {extraRender}
      </Space>
    </div>
  )
}

export type MangoFormRadioProps = MangoControlRadioProps &
  FormItemProps & {
    extraFormFieldProps?: FormItemProps
    extraRawFieldProps?: Record<string, any>
  }

export const MangoFormRadio: FC<MangoFormRadioProps> = ({
  options,
  onChange,
  beforeChange,
  containerClassName,
  itemClassName,
  itemSelectedClassName,
  tagClassName,
  itemWidth,
  itemHeight,
  theme,
  extraRender,
  extraFormFieldProps,
  extraRawFieldProps,
  ...rest
}) => {
  return (
    <Form.Item {...rest} {...extraFormFieldProps}>
      <MangoControlRadio
        {...{
          options,
          onChange,
          beforeChange,
          containerClassName,
          itemClassName,
          itemSelectedClassName,
          tagClassName,
          itemWidth,
          itemHeight,
          theme,
          extraRender,
          extraRawFieldProps,
        }}
      />
    </Form.Item>
  )
}
