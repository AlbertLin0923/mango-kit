import { useRef } from 'react'
import { MangoProTable } from '@mango-kit/components'
import { sleep } from '@mango-kit/utils'
import '@mango-kit/components/styles'
import dayjs from 'dayjs'
import { ConfigProvider, Button, Space, App } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'

import type { MangoProTableHandle } from '@mango-kit/components'

const nodeMap = [
  { label: '待处理', value: 1, color: '#FA8C16' },
  { label: '处理中', value: 2, color: '#2492FF' },
  { label: '已处理', value: 3, color: '#52C41A' },
]

const API = {
  getSearchOptions: async () => {
    await sleep(1000)
    return {
      code: 200,
      data: {
        nodeCode: [
          { label: '待处理', value: 1, color: '#FA8C16' },
          { label: '处理中', value: 2, color: '#2492FF' },
          { label: '已处理', value: 3, color: '#52C41A' },
        ],
        orderOriginList: [
          { label: '天猫', value: 1, color: '#FA8C16' },
          { label: '淘宝', value: 2, color: '#2492FF' },
          { label: '小程序', value: 3, color: '#52C41A' },
        ],
      },
    }
  },
  getList: async () => {
    await sleep(1000)
    return {
      code: 200,
      rows: new Array(5).fill(undefined).map((i) => ({
        orderNo: Math.random().toString(36).substring(3, 19),
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        nodeCode: nodeMap[0]?.value,
      })),
      total: 100,
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
              key: 'nodeCode',
              map: nodeMap,
            },
            list: [
              {
                title: '去处理',
                action: (record: any, navigate: any) => {
                  // navigate(`/detail?id=${record.id}pageType=modify`)
                  // mangoProTableRef.current.refresh()
                  mangoProTableRef?.current?.modal?.confirm({
                    title: '录入新订单',
                    content: '请填写订单信息',
                    onOk: async () => {
                      mangoProTableRef.current.refresh()
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
              title: '下单时间',
              dataIndex: 'createTime',
              width: 200,
            },
            {
              title: '订单处理进度',
              dataIndex: 'nodeCode',
              width: 120,
              valueEnum: nodeMap,
            },
          ]}
          pageTips={{
            type: 'info',
            message: <div>请在该页面查询您的待处理订单</div>,
            showIcon: true,
            closable: true,
          }}
          pageType="table"
          ref={mangoProTableRef}
          request={{
            getSearchOptions: {
              api: API.getSearchOptions,
              appendParams: { type: 1 },
            },
            getList: {
              api: API.getList,
            },
          }}
          rowKey="orderNo"
          searchFormConfigList={[
            [
              {
                name: 'nodeCode',
                label: '处理进度',
                type: 'mango-radio',
                initialValue: '',
                optionFilter: (data: any) => data?.nodeCodeList,
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
                optionFilter: (data: any) => data?.orderOriginList,
              },
              {
                name: 'orderCreateTime',
                label: '订单创建时间',
                type: 'date-range-picker',
                picker: 'date',
                initialValue: undefined,
              },
            ],
          ]}
          toolBarRender={() => {
            return (
              <Space>
                <Button
                  key="button"
                  type="primary"
                  onClick={() => {
                    // mangoProTableRef?.current?.modal?.confirm({
                    //   title: '录入新订单',
                    //   content: '请填写订单信息',
                    //   onOk: async () => {
                    //     mangoProTableRef.current.refresh()
                    //   },
                    // })
                  }}
                >
                  新建订单
                </Button>
                <Button
                  key="button"
                  onClick={() => {
                    // mangoProTableRef?.current?.modal?.confirm({
                    //   title: '录入新订单',
                    //   content: '请填写订单信息',
                    //   onOk: async () => {
                    //     mangoProTableRef.current.refresh()
                    //   },
                    // })
                  }}
                >
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
