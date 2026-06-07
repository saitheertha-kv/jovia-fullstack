import React from 'react'
import style from './AddLink.module.css'
const AddLink = () => {
  return (
    <div>
      <div className={style.card}>
                      <h2>Add Link</h2>
              
                      <div className={style.inputGroup}>
                        <label>Url</label>
                        <input type="url" placeholder="Enter your Url" />
                      </div>
              
                      <button className={style.button}>Submit</button>
                    </div>
    </div>
  )
}

export default AddLink