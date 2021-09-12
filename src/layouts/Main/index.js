import React, { useEffect } from "react"
import { Drawer, Alert, Statistic } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from "react-helmet"
import { addHours } from "date-fns"
import Header from "@/components/Header"
import Menu from "@/components/Menu"
import Cookies from "@/components/Cookies"
import * as style from "./style.module.scss"

let touchStartPrev = 0
let touchStartLocked = false

const MainLayout = ({ children }) => {
  const dispatch = useDispatch()
  const isMobileMenuOpen = useSelector((state) => state.settings.isMobileMenuOpen)
  const history = useSelector((state) => state.settings.history)
  const networkState = useSelector((state) => state.settings.networkState)

  const toggleMobileMenu = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: !isMobileMenuOpen,
      },
    })
  }

  useEffect(() => {
    const unify = (e) => {
      return e.changedTouches ? e.changedTouches[0] : e
    }
    document.addEventListener(
      'touchstart',
      (e) => {
        const x = unify(e).clientX
        touchStartPrev = x
        touchStartLocked = x > 70
      },
      { passive: false },
    )
    document.addEventListener(
      'touchmove',
      (e) => {
        const x = unify(e).clientX
        const prev = touchStartPrev
        if (x - prev > 50 && !touchStartLocked) {
          toggleMobileMenu()
          touchStartLocked = true
        }
      },
      { passive: false },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  return (
    <div className={style.layout}>
      <Helmet titleTemplate="%s | RayStake" title="ADA & XRAY Rewards">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="preload" href="/resources/font/circular.css" as="style" />
        <link href="/resources/font/circular.css" rel="stylesheet" />
        <meta property="og:url" content="https://stake.rraayy.com" />
        <meta
          name="description"
          content="Advanced Ecosystem for Cardano Blockchain Platform. All about ADA finances (DeFi) in one place."
        />
      </Helmet>
      <div>
        <Header />
        {history.syncingNextEpoch && (
          <Alert
            className="mb-4"
            message={
              <div>
                <span>Epoch {networkState?.currentEpoch?.number || 0} is syncing. Rewards accruals will finish in about</span>{" "}
                <Statistic.Countdown
                  className="ray__count__inline"
                  value={addHours(new Date(networkState?.currentEpoch?.startedAt || null), 6)}
                  format="D[d] HH[h] mm[m] ss[s]"
                />
              </div>
            }
            type="warning"
            showIcon
          />
        )}
      </div>
      <div className={style.body}>
        <Drawer
          closable={false}
          visible={isMobileMenuOpen}
          placement="left"
          onClose={toggleMobileMenu}
          maskClosable
          getContainer={null}
          width={270}
        >
          <Menu />
        </Drawer>
        <div className={`${style.menu} d-none d-lg-flex`}>
          <Menu />
        </div>
        <div className={style.content}>
          {children}
        </div>
      </div>
      <Cookies />
    </div>
  )
}

export default MainLayout
