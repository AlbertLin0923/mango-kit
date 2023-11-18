---
nav:
  title: 组件
group:
  title: 组件列表
---

# SvgIcon

基于 [svg-sprite-loader](https://github.com/JetBrains/svg-sprite-loader) 的 SVG 图标组件

## 使用方法

在使用 [@mango-scripts/react-scripts](https://github.com/AlbertLin0923/mango-scripts/tree/main/packages/react-scripts) 的基础上

1. 在 iconfont 或者其他图标库挑选中意的图标，下载 SVG 格式的文件到本地
2. 将 svg 文件放到项目 src/icons/svg 文件夹下
3. 在组件或者页面引入并使用

```tsx | pure
import { SvgIcon } from '@mango-kit/components'
import '@mango-kit/components/styles'

const Demo: FC = () => {
  return (
    <div>
      <SvgIcon
        className="xxx"
        style={{ color: 'red' }}
        iconClass="password"
      ></SvgIcon>
    </div>
  )
}
```

- svgIcon 默认会读取其父级的 color fill: currentColor;你可以改变父级的 color 或者直接改变 fill 的颜色即可。
- svgIcon 可以通过 style 或者 className 设置其样式

参考资料: [手摸手，带你优雅的使用 icon](https://juejin.cn/post/6844903517564436493)
