/* eslint-disable react/no-array-index-key */
import { useState, useMemo, useEffect } from 'react'
import { Form, Space, Button, Row, Col } from 'antd'

import { renderQueryFormFields } from './renderQueryFormFields'

import type { QueryFormFieldsType, MangoProTableProps } from '../../type'

const isDoubleArray = (arr: any) => {
  return Array.isArray(arr) && arr.every((i) => Array.isArray(i))
}

const getQueryFormInitialValues = (list: QueryFormFieldsType | undefined) => {
  const obj: Record<string, any> = {}

  list?.forEach((r) => {
    r &&
      Array.isArray(r) &&
      r?.forEach((c: any) => {
        obj[c.name] = c.initialValue
      })
  })
  return obj
}

type QueryFormOptionData = {
  data: any[]
  already: boolean
}

type QueryFormProps = PropsWithChildren<{
  queryFormFields: QueryFormFieldsType
  onSubmit: (
    values: Record<string, any>,
    queryFormOptionData: Record<string, any>,
    triggerRequest: boolean,
  ) => void
  request: MangoProTableProps['request']
}>

const QueryForm: FC<QueryFormProps> = ({
  queryFormFields,
  request,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  const [queryFormOptionData, setQueryFormOptionData] =
    useState<QueryFormOptionData>({
      data: [],
      already: false,
    })

  const queryFormInitialValues = useMemo(() => {
    return getQueryFormInitialValues(queryFormFields ?? undefined)
  }, [queryFormFields])

  const immediateQueryFormFieldList = useMemo(() => {
    const result: string[] = []
    queryFormFields.forEach((it) => {
      it.forEach((i) => {
        i?.immediate && result.push(i.name)
      })
    })
    return result
  }, [queryFormFields])

  const handleValuesChange = (changedValues: any) => {
    if (
      Object.keys(changedValues).findIndex((m) => {
        return immediateQueryFormFieldList.includes(m)
      }) > -1 &&
      queryFormOptionData?.already
    ) {
      onSubmit(form.getFieldsValue(true), queryFormOptionData?.data ?? [], true)
    }
  }

  const getQueryFormOptionData = async () => {
    if (request?.getQuery && request?.getQuery?.api) {
      const { success, data } = await request.getQuery.api({
        ...(request?.getQuery?.appendParams ?? {}),
      })
      if (success && data) {
        setQueryFormOptionData(() => ({ data, already: true }))
        onSubmit(form.getFieldsValue(true), data, true)
      }
    } else {
      onSubmit(form.getFieldsValue(true), queryFormOptionData?.data ?? [], true)
    }
  }

  useEffect(() => {
    getQueryFormOptionData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!queryFormOptionData?.already) {
    return null
  }

  return (
    <Form
      className="mango-pro-table-query-form"
      form={form}
      initialValues={queryFormInitialValues}
      labelAlign="left"
      name="form"
      onFinish={() => {
        onSubmit(
          form.getFieldsValue(true),
          queryFormOptionData?.data ?? [],
          true,
        )
      }}
      onValuesChange={handleValuesChange}
    >
      {isDoubleArray(queryFormFields) &&
        queryFormFields.map((row, index: number) => {
          if (index !== queryFormFields.length - 1) {
            return (
              <Row gutter={64} key={index}>
                {row.map((col) => {
                  return (
                    <Col key={col.name}>
                      {renderQueryFormFields(col, queryFormOptionData, form)}
                    </Col>
                  )
                })}
              </Row>
            )
          } else {
            return (
              <Row gutter={64} key={index}>
                {row.map((col) => {
                  return (
                    <Col key={col.name}>
                      {renderQueryFormFields(col, queryFormOptionData, form)}
                    </Col>
                  )
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
                          onSubmit(
                            queryFormInitialValues,
                            queryFormOptionData?.data,
                            true,
                          )
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

export default QueryForm
