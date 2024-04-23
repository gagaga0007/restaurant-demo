const adminPrefix = 'admin'

export const routes = {
  /** BASE */
  LOGIN: 'login',
  /** ADMIN */
  LAYOUT_EDIT: `${adminPrefix}/layout-edit`,
  ORDER_LIST: `${adminPrefix}/orders`,
  /** CUSTOMER */
  LAYOUT_SELECT: 'layout-select',
}
