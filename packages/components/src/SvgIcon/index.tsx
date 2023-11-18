import type { SVGProps } from 'react'

export type SvgIconProps = {
  iconClass: string
  className?: string
} & SVGProps<SVGSVGElement>

const SvgIcon: FC<SvgIconProps> = ({ iconClass, className, ...restProps }) => {
  return (
    <svg
      aria-hidden="true"
      className={className ? 'mango-svg-icon ' + className : 'mango-svg-icon'}
      {...restProps}
    >
      <use href={`#icon-${iconClass}`} />
    </svg>
  )
}

export { SvgIcon }
