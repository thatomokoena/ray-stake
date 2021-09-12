import React from "react"
import { Statistic } from 'antd'
import { Link } from "gatsby"
import { useSelector, useDispatch } from "react-redux"
import { addDays } from "date-fns"
import { format } from "@/utils"
import {
  SVGCardano,
  SVGRay,
  SVGDashboard,
  SVGLineChart,
  SVGZap,
  SVGPercent,
  SVGInfo,
} from "@/svg"
import * as style from "./style.module.scss"
import packageInfo from '../../../package.json'

const menu = [
  {
    title: 'Rewards Distribution',
    icon: <SVGDashboard />,
    link: '/',
  },
  {
    title: 'Track & Withdraw',
    icon: <SVGLineChart />,
    link: '/track/',
  },
  {
    title: 'Pools',
    icon: <SVGZap />,
    link: '/pools/',
  },
  {
    title: 'Calculator',
    icon: <SVGPercent />,
    link: '/calculator/',
  },
  {
    title: 'FAQ',
    icon: <SVGInfo />,
    link: '/faq/',
  },
]

const Menu = () => {
  const dispatch = useDispatch()
  const networkState = useSelector((state) => state.settings.networkState)
  const prices = useSelector((state) => state.settings.prices)
  const pools = useSelector((state) => state.settings.pools)

  const toggleMobileMenu = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: false,
      },
    })
  }

  return (
    <div className={style.menu}>
      <div className={style.menuLinks}>
        {menu.map((item, index) => {
          return (
            <Link
              key={index}
              to={item.link}
              className={`${style.menuBtn} ray__btn`}
              activeClassName={style.menuBtnActive}
              onClick={toggleMobileMenu}
            >
              <span className="icn me-2">
                {item.icon}
              </span>
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>
      <div className={style.menuData}>
        <div className={style.menuDataItem}>
          <div className={style.menuDataItemTitle}>Live XRAY Mining Rate</div>
          <div className={style.menuDataItemAmount}>
            {format(pools?.nextRate / 1000000 || 0, 6)}
            <span className="ray__ticker ms-2">ADA</span>
          </div>
        </div>
        <div className={style.menuDataItem}>
          <div className={style.menuDataItemTitle}>XRAY Price</div>
          <div className={style.menuDataItemAmount}>
            —
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className={style.menuDataItem}>
              <div className={style.menuDataItemTitle}>ADA Price</div>
              <div className={style.menuDataItemAmount}>
                ${format(prices?.cardano?.usd || 0, 2)}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className={style.menuDataItem}>
              <div className={style.menuDataItemTitle}>BTC Price</div>
              <div className={style.menuDataItemAmount}>
                ${format(prices?.bitcoin?.usd || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.menuData}>
        <div className="row">
          <div className="col-6">
            <div className={style.menuDataItem}>
              <div className={style.menuDataItemTitle}>Epoch</div>
              <div className={style.menuDataItemAmount}>
                {format(networkState?.currentEpoch?.number || 0)}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className={style.menuDataItem}>
              <div className={style.menuDataItemTitle}>Block</div>
              <div className={style.menuDataItemAmount}>
                {format(networkState?.tip?.number || 0)}
              </div>
            </div>
          </div>
        </div>
        <div className={style.menuDataItem}>
          <div className={style.menuDataItemTitle}>Epoch Ends In</div>
          <div className={style.menuDataItemAmount}>
            <Statistic.Countdown
              className="ray__count__inline"
              value={addDays(new Date(networkState?.currentEpoch?.startedAt || null), 5)}
              format="D[d] HH[h] mm[m] ss[s]"
            />
          </div>
        </div>
      </div>
      <div className={style.menuFooter}>
        <div className="mb-1">
          Powered with{" "}
          <span className={style.menuFooterCardano}>
            <SVGCardano />
          </span>{" "}
          Cardano
        </div>
        <div className={style.menuFooterLogo}>
          <SVGRay />
          <span className="me-2">
            <strong>RayStake</strong>
          </span>
          <span>v{packageInfo.version}</span>
        </div>
      </div>
    </div>
  )
}

export default Menu
