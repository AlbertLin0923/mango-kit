import { useRef } from 'react'
import { MangoProTable } from '@mango-kit/components'
import { sleep } from '@mango-kit/utils'
import '@mango-kit/components/styles'
import { ConfigProvider, Button, Space, App } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import mockjs from 'mockjs'

import type { MangoProTableHandle } from '@mango-kit/components'

const statusMap = [
  { label: '待处理', value: 1, color: '#FA8C16' },
  { label: '处理中', value: 2, color: '#2492FF' },
  { label: '已处理', value: 3, color: '#52C41A' },
]

const orderOriginMap = [
  { label: '天猫', value: 1, color: '#FA8C16' },
  { label: '淘宝', value: 2, color: '#2492FF' },
  { label: '小程序', value: 3, color: '#52C41A' },
  {
    label:
      '这是一个超长的text，这是一个超长的text，这是一个超长的text，这是一个超长的text，这是一个超长的text，这是一个超长的text，这是一个超长的text，这是一个超长的text，这是一个超长的text',
    value: 4,
    color: '#52C41A',
  },
]

const API = {
  getQuery: async () => {
    await sleep(1000)
    return {
      success: true,
      data: {
        statusMap: statusMap,
        orderOriginMap: orderOriginMap,
      },
      msg: '请求成功',
    }
  },
  getList: async (query: Record<string, any>) => {
    await sleep(1000)

    const { pageSize, page } = query

    console.log(pageSize, page)
    return {
      success: true,
      data: mockjs.mock({
        'list|5': [
          {
            orderNo: mockjs.Random.id(),
            status: statusMap[0]?.value,
            orderOrigin: function () {
              return orderOriginMap[0].value
            },
            createTime: mockjs.Random.datetime(),
          },
        ],
        total: 100,
      }),
      msg: '请求成功',
    }
  },
}

const Demo: FC = () => {
  const mangoProTableRef = useRef<MangoProTableHandle>(null)
  return (
    <ConfigProvider locale={zh_CN}>
      <App>
        <MangoProTable
          columnActions={{
            width: 120,
            showAliasConfig: {
              key: 'status',
              map: statusMap,
            },
            list: [
              {
                title: '去处理',
                action: (record: any, navigate: any) => {
                  mangoProTableRef?.current?.modal?.confirm({
                    title: '录入新订单',
                    content: '请填写订单信息',
                    onOk: async () => {
                      mangoProTableRef?.current?.refresh()
                    },
                  })
                },
                show: ['待处理'],
              },
              {
                title: '查看详情',
                action: (record: any, navigate: any) => {
                  navigate(`/detail?id=${record.id}pageType=view`)
                },
                show: ['处理中', '已处理'],
              },
            ],
          }}
          columns={[
            {
              title: '订单编号',
              dataIndex: 'orderNo',
              width: 220,
              copyable: true,
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              width: 200,
            },
            {
              title: '订单来源',
              dataIndex: 'orderOrigin',
              width: 120,
              valueType: 'map',
              ellipsis: true,
              valueEnum: (queryFormOptionData: any) => {
                return queryFormOptionData?.orderOriginMap
              },
            },
            {
              title: '订单处理进度',
              dataIndex: 'status',
              width: 120,
              fixed: 'right',
              valueType: 'status',
              valueEnum: statusMap,
            },
          ]}
          pageTips={{
            type: 'info',
            message: <div>请在该页面查询您的待处理订单</div>,
            showIcon: true,
            closable: true,
          }}
          pageType="table"
          queryFormFields={[
            [
              {
                name: 'status',
                label: '处理进度',
                type: 'radio',
                initialValue: 1,
                optionFilter: (data: any) => data?.statusMap,
                immediate: true,
              },
            ],
            [
              {
                name: 'orderNo',
                label: '订单编号',
                type: 'input',
                maxLength: 50,
                initialValue: undefined,
                placeholder: '请输入订单编号',
              },
              {
                name: 'orderOrigin',
                label: '订单来源',
                type: 'select',
                initialValue: undefined,
                placeholder: '请选择订单来源',
                optionFilter: (data: any) => data?.orderOriginMap,
                extraFormFieldProps: {
                  tooltip: '下单的平台',
                },
              },
              {
                name: 'orderCreateTime',
                label: '订单创建时间',
                type: 'date-range-picker',
                picker: 'date',
                initialValue: undefined,
                extraRawFieldProps: {
                  showTime: true,
                },
              },
            ],
          ]}
          ref={mangoProTableRef}
          request={{
            getQuery: {
              api: API.getQuery,
              appendParams: { type: 1 },
            },
            getList: {
              api: API.getList,
            },
          }}
          rowKey="orderNo"
          toolBarRender={() => {
            return (
              <Space>
                <Button key="button" type="primary" onClick={() => {}}>
                  新建订单
                </Button>
                <Button key="button" onClick={() => {}}>
                  批量下载数据
                </Button>
              </Space>
            )
          }}
        />
      </App>
    </ConfigProvider>
  )
}

export default Demo
