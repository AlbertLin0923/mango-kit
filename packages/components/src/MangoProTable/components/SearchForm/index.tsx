import { useMemo } from 'react'
import {
  Form,
  Select,
  Space,
  Button,
  Input,
  Typography,
  DatePicker,
  Row,
  Col,
} from 'antd'
import { isFunction } from 'lodash-es'

import { MangoFormRadio } from '../../../MangoFormRadio'

import type { DatePickerProps } from 'antd'
import type { Dayjs } from 'dayjs'

export type SearchFormConfigItemType =
  | {
      name: string
      type: 'input'
      label?: string
      placeholder?: string
      initialValue?: string | number
      maxLength?: number
    }
  | {
      name: string
      type: 'select'
      optionFilter:
        | string
        | ((data: any) => { label: string; value: string | number }[])
      label?: string
      placeholder?: string
      initialValue?: string | number
      immediate?: boolean
    }
  | {
      name: string
      type: 'date-range-picker'
      picker: DatePickerProps['picker']
      label?: string
      initialValue?: Dayjs[]
      immediate?: boolean
    }
  | {
      name: string
      type: 'mango-form-radio'
      optionFilter:
        | string
        | ((data: any) => { label: string; value: string | number }[])
      label?: string
      placeholder?: string
      initialValue?: string | number
      immediate?: boolean
    }
  | {
      name: string
      type: 'text'
      label?: string
      initialValue?: string | number
    }

export type SearchFormConfigListType = SearchFormConfigItemType[][]

export type SearchOptionsType = {
  already: boolean
  data: any
}

export type InitSearchFormValueType = Record<string, any>

export type SearchFormValueType = Record<string, any>

export type SearchFormProps = PropsWithChildren<{
  searchFormConfigList: SearchFormConfigListType
  searchOptions: SearchOptionsType
  initSearchFormValue: InitSearchFormValueType
  onSubmit: (values: SearchFormValueType, triggerRequest: boolean) => void
}>

const { RangePicker } = DatePicker

const isDoubleArray = (arr: any) => {
  return Array.isArray(arr) && arr.every((i) => Array.isArray(i))
}

const SearchForm: FC<SearchFormProps> = ({
  searchFormConfigList,
  searchOptions,
  initSearchFormValue,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  const immediateFormConfigList = useMemo(() => {
    const result: string[] = []
    searchFormConfigList.forEach((it) => {
      it.forEach((i: any) => {
        i?.immediate && result.push(i.name)
      })
    })
    return result
  }, [searchFormConfigList])

  const handleFinish = () => {
    onSubmit(form.getFieldsValue(true), true)
  }

  const handleValuesChange = (changedValues: any) => {
    if (
      Object.keys(changedValues).findIndex((m) => {
        return immediateFormConfigList.includes(m)
      }) > -1
    ) {
      onSubmit(form.getFieldsValue(true), true)
    }
  }
  const renderItem = (col: any) => {
    switch (col?.type) {
      case 'input': {
        return (
          <Form.Item
            label={col.label}
            name={col.name}
            normalize={(value: any) => {
              return value.trim()
            }}
          >
            <Input
              maxLength={col.maxLength}
              placeholder={col.placeholder}
              style={{ width: '100%' }}
              allowClear
            />
          </Form.Item>
        )
      }

      case 'select': {
        const selectFilter = col['optionFilter']
        const selectOptions = !isFunction(selectFilter)
          ? searchOptions.data?.[selectFilter]
          : selectFilter(searchOptions.data)

        return (
          <Form.Item label={col.label} name={col.name}>
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
            >
              {selectOptions.map((i: any) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )
      }

      case 'date-range-picker':
        return (
          <Form.Item label={col.label} name={col.name}>
            <RangePicker picker={col.picker} />
          </Form.Item>
        )
      case 'mango-form-radio': {
        const radioFilter = col['optionFilter']
        const radioOptions = !isFunction(radioFilter)
          ? searchOptions.data?.[radioFilter]
          : radioFilter(searchOptions.data)

        return (
          <MangoFormRadio
            label={col.label}
            name={col.name}
            options={radioOptions}
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
          >
            {() => {
              const formData = form.getFieldsValue(true)
              return <Typography.Text>{formData[col.name]}</Typography.Text>
            }}
          </Form.Item>
        )
      }

      default:
        return null
    }
  }

  return (
    <Form
      className="mango-pro-table-search"
      form={form}
      initialValues={initSearchFormValue}
      labelAlign="left"
      name="form"
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
    >
      {isDoubleArray(searchFormConfigList) &&
        searchFormConfigList.map((row, index: number) => {
          if (index !== searchFormConfigList.length - 1) {
            return (
              <Row gutter={64} key={index}>
                {row.map((col) => {
                  return <Col key={col.name}>{renderItem(col)}</Col>
                })}
              </Row>
            )
          } else {
            return (
              <Row gutter={64} key={index}>
                {row.map((col) => {
                  return <Col key={col.name}>{renderItem(col)}</Col>
                })}
                <Col>
                  <Form.Item>
                    <Space>
                      <Button htmlType="submit" type="primary">
                        查询
                      </Button>
                      <Button
                        onClick={() => {
                          form.resetFields()
                          onSubmit(initSearchFormValue, true)
                        }}
                      >
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            )
          }
        })}
    </Form>
  )
}

export default SearchForm
