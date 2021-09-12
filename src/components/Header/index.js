import React from "react"
import { Button } from "antd"
import { Link } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import {
  SVGRay,
  SVGWallet,
  SVGSun,
  SVGMoon,
  SVGCardano,
  SVGMenu,
} from "@/svg"
import * as style from "./style.module.scss"

const Header = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.settings.theme)
  const isMobileMenuOpen = useSelector((state) => state.settings.isMobileMenuOpen)

  const changeTheme = () => {
    dispatch({
      type: "settings/CHANGE_THEME",
      theme: theme === "default" ? "dark" : "default",
    })
  }

  const toggleMobileMenu = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: !isMobileMenuOpen,
      },
    })
  }

  return (
    <div>
      <div className="ray__block mb-0">
        <div className={style.header}>
          <Link to="/" className={style.headerLogo}>
            <SVGRay />
            <span>
              <strong>RayStake</strong>
            </span>
          </Link>
          <div className={`${style.headerLine} d-none d-sm-inline`} />
          <span className="flex-grow-1 d-none d-sm-inline pe-2 pe-md-4">
            ADA & XRAY{" "}
            <span className={style.headerCardano}>
              <SVGCardano />
            </span>{" "}
            Cardano Rewards
          </span>
          <span
            className={`cursor-pointer ms-auto me-3 ms-sm-0 ${style.headerTheme}`}
            onClick={changeTheme}
            onKeyPress={changeTheme}
            role="button"
            tabIndex="0"
          >
            <span className={theme === "default" ? "" : "d-none"}>
              <span className="icn">
                <SVGSun />
              </span>
            </span>
            <span className={theme !== "default" ? "" : "d-none"}>
              <span className="icn">
                <SVGMoon />
              </span>
            </span>
          </span>
          <span className="me-3 me-lg-0">
            <a
              href="https://raywallet.io"
              className="ant-btn ray__btn ray__btn--round"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="icn pe-0 pe-sm-2">
                <SVGWallet />
              </span>
              <span className="d-none d-sm-inline">RayWallet</span>
            </a>
          </span>
          <span className="d-inline d-lg-none cursor-pointer">
            <Button
              className="ant-btn ray__btn ray__btn--round"
              onClick={toggleMobileMenu}
              onKeyPress={toggleMobileMenu}
            >
              <span className="icn">
                <SVGMenu />
              </span>
            </Button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Header
