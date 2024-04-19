import React from 'react'

function NotAuthorized({message}) {
  return (
    <div>
        {message?.status} {message?.message}
    </div>
  )
}

export default NotAuthorized