import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span>BusWatch Admin &copy; {new Date().getFullYear()}</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
