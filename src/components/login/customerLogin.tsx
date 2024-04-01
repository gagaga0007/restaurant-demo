import { CustomerOrderEditor } from '@/components/login/customerOrderEditor.tsx'
import { CustomerLoginEditor } from '@/components/login/customerLoginEditor.tsx'
import { useState } from 'react'

export const CustomerLogin = () => {
  const [showCustomerEdit, setShowCustomerEdit] = useState(false)

  return (
    <>
      {showCustomerEdit ? (
        <CustomerOrderEditor setIsLogin={setShowCustomerEdit} />
      ) : (
        <CustomerLoginEditor setIsLogin={setShowCustomerEdit} />
      )}
    </>
  )
}
