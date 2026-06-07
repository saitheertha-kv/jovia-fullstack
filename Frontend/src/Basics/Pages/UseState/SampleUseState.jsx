import React, { useState } from 'react'

const SampleUseState = () => {
    // const[fruit,setFruit]=useState('apple')
    // const change = () => {
    //     setFruit('orange')
    // }
const[name,setName]=useState('')
  return (
    <div>
{/* <button onClick={()=>{setFruit('orange')}}>Change</button> */}
  {/* <div>{fruit}</div> */}
<div>Name</div><input type="text" onChange={(e)=>{setName(e.target.value)}}/>
<div>{name}</div>
    </div>
  )
}

export default SampleUseState