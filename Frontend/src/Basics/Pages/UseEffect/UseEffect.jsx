import React, { useEffect, useState } from 'react'

const UseEffectPage = () => {

  const [nameH, setName] = useState('')
  useEffect(() => {
    setName(prompt("Enter ur name")
    )
  }, [])
  return (
    <div>{nameH}</div>
  )
}

export default UseEffectPage

