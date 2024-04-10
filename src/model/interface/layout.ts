export interface LayoutProps {
  id: string | number
  imageData?: string
  jsonData: string
}

export interface LayoutEditProps extends Partial<LayoutProps> {}
