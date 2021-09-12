import React from "react"
import * as style from "./style.module.scss"

const Breadcrumbs = ({ title }) => {
  return (
    <div className={style.bread}>
      <span className="me-2">RayStake</span>
      <span className="me-2">/</span>
      <span>{title}</span>
    </div>
  )
}

export default Breadcrumbs
