import { Form, Select, Input, Typography, DatePicker } from 'antd'
import { isFunction } from 'lodash-es'
import dayjs from 'dayjs'

import { MangoFormRadio } from '../../../MangoFormRadio'

import type { FormInstance } from 'antd'

export const renderQueryFormFields = (
  col: any,
  queryFormOptionData: {
    already: boolean
    data: any
  },
  form: FormInstance,
) => {
  switch (col?.type) {
    case 'input': {
      return (
        <Form.Item
          label={col.label}
          name={col.name}
          normalize={(value: any) => {
            return value.trim()
          }}
          {...col?.extraFormFieldProps}
        >
          <Input
            maxLength={col.maxLength}
            placeholder={col.placeholder}
            style={{ width: '200px' }}
            allowClear
            {...col?.extraRawFieldProps}
          />
        </Form.Item>
      )
    }

    case 'select': {
      const selectFilter = col['optionFilter']
      const selectOptions = !isFunction(selectFilter)
        ? queryFormOptionData?.data?.[selectFilter]
        : selectFilter(queryFormOptionData?.data)

      return (
        <Form.Item
          label={col.label}
          name={col.name}
          {...col?.extraFormFieldProps}
        >
          <Select
            filterOption={(input, option) =>
              (String(option?.children) ?? '')
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            optionFilterProp="children"
            placeholder={col.placeholder}
            style={{ width: '200px' }}
            allowClear
            showSearch
            {...col?.extraRawFieldProps}
          >
            {selectOptions?.map((i: any) => (
              <Select.Option key={i.value} value={i.value}>
                {i.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    }

    case 'date-picker':
      return (
        <Form.Item
          getValueFromEvent={(value: any) => {
            return value && value.valueOf()
          }}
          getValueProps={(value: any) => ({
            value: value && dayjs(Number(value)),
          })}
          label={col.label}
          name={col.name}
          {...col?.extraFormFieldProps}
        >
          <DatePicker
            picker={col.picker}
            placeholder={col.placeholder}
            presets={[
              { label: '昨天', value: dayjs().add(-1, 'd') },
              { label: '上周', value: dayjs().add(-7, 'd') },
              { label: '上月', value: dayjs().add(-1, 'month') },
            ]}
            allowClear
            {...col?.extraRawFieldProps}
          />
        </Form.Item>
      )

    case 'date-range-picker':
      return (
        <Form.Item
          getValueFromEvent={(value: any) => {
            return value && [value[0].valueOf(), value[1].valueOf()]
          }}
          getValueProps={(value: any) => ({
            value: value && [dayjs(Number(value[0])), dayjs(Number(value[1]))],
          })}
          label={col.label}
          name={col.name}
          {...col?.extraFormFieldProps}
        >
          <DatePicker.RangePicker
            picker={col.picker}
            placeholder={col.placeholder}
            presets={[
              {
                label: '今天',
                value: [dayjs().startOf('day'), dayjs().endOf('day')],
              },
              {
                label: '本周',
                value: [dayjs().startOf('week'), dayjs().endOf('week')],
              },
              {
                label: '本月',
                value: [dayjs().startOf('month'), dayjs().endOf('month')],
              },
            ]}
            allowClear
            {...col?.extraRawFieldProps}
          />
        </Form.Item>
      )

    case 'radio': {
      const radioFilter = col['optionFilter']
      const radioOptions = !isFunction(radioFilter)
        ? queryFormOptionData?.data?.[radioFilter]
        : radioFilter(queryFormOptionData?.data)

      return (
        <MangoFormRadio
          extraFormFieldProps={col?.extraFormFieldProps}
          extraRawFieldProps={col?.extraRawFieldProps}
          label={col.label}
          name={col.name}
          options={radioOptions ?? []}
          theme="nav"
        />
      )
    }

    case 'text': {
      return (
        <Form.Item
          key={col.name}
          label={col.label}
          shouldUpdate={(prevValues, curValues) =>
            prevValues?.[col.name] !== curValues?.[col.name]
          }
          {...col?.extraFormFieldProps}
        >
          {() => {
            const formData = form.getFieldsValue(true)
            return (
              <Typography.Text {...col?.extraRawFieldProps}>
                {formData[col.name]}
              </Typography.Text>
            )
          }}
        </Form.Item>
      )
    }

    default:
      return null
  }
}
