import { KeyPairProps } from '@/model/interface/base.ts'
import { OrderTypeEnum } from '@/model/interface/order.ts'

export const userOrderTypeOptions: (KeyPairProps & { color: string })[] = [
  { key: '早餐', value: OrderTypeEnum.BREAKFAST, color: '#13c2c2' },
  { key: '午餐', value: OrderTypeEnum.LUNCH, color: '#fa8c16' },
  { key: '晚餐', value: OrderTypeEnum.DINNER, color: '#2f54eb' },
]
