import React from "react"
import { useSelector } from "react-redux"
import { message, Button } from "antd"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { format, formatValue, truncate } from "@/utils"
import { SVGFiles, SVGCheckCircled } from "@/svg"
import * as style from "./style.module.scss"

const Pools = () => {
  const pools = useSelector((state) => state.settings.pools)

  console.log(pools)

  return (
    <div>
      <h5 className="mb-4">
        Ray Pools Statistics
      </h5>
      <div className="row">
        <div className="col-12 col-md-4">
          <div className="ray__card">
            <div className="ray__card__title">Live Stake</div>
            <div className="ray__card__amount">
              <span className="me-2">
                {format(pools?.totalLiveStake / 1000000 || 0)}
              </span>
              <span className="ray__ticker ray__ticker__lg">ADA</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="ray__card">
            <div className="ray__card__title">Total ADA Rewards</div>
            <div className="ray__card__amount">
              <span>{format(pools?.totalRewards / 1000000 || 0)}</span>
              <span className="ray__card__amount__small me-2">.{(pools?.totalRewards / 1000000 || 0).toString().split(".")[1] || '000000'}</span>
              <span className="ray__ticker ray__ticker__lg">ADA</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="ray__card">
            <div className="ray__card__title">Delegators / Pools</div>
            <div className="ray__card__amount">
              {pools?.pools?.reduce((accum, pool) => accum + parseInt(pool.delegators), 0) || 0}{" / "}
              {pools?.pools?.length || 0}
            </div>
          </div>
        </div>
      </div>
      <h5 className="mb-4">
        Ray Pools
      </h5>
      <div className="row">
        {pools?.pools?.map((pool, index) => {
          console.log(pool)
          const isSaturated = pool.total_stake > 61000000 * 1000000
          return (
            <div className="col-12 col-sm-6" key={index}>
              <div className={style.pool}>
                <span className="badge">{isSaturated ? 'SATURATED' : 'ACTIVE'}</span>
                <div className={style.poolItem}>
                  <div className={style.poolLabel}>Pool Id</div>
                  <div className={style.poolValue}>
                    <CopyToClipboard
                      text={pool.pool_id_bech32}
                      onCopy={() =>
                        message.success("Pool ID copied successfully")
                      }
                    >
                      <strong className="cursor-pointer">
                        {truncate(pool.pool_id_bech32, 12)}
                        <span className="icn ms-2">
                          <SVGFiles />
                        </span>
                      </strong>
                    </CopyToClipboard>
                  </div>
                </div>
                <div className={style.poolItem}>
                  <div className={style.poolLabel}>Pool Hash</div>
                  <div className={style.poolValue}>
                    <CopyToClipboard
                      text={pool.pool_id}
                      onCopy={() =>
                        message.success("Pool Hash copied successfully")
                      }
                    >
                      <strong className="cursor-pointer">
                        {truncate(pool.pool_id, 12)}
                        <span className="icn ms-2">
                          <SVGFiles />
                        </span>
                      </strong>
                    </CopyToClipboard>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className={style.poolItem}>
                      <div className={style.poolLabel}>Ticker</div>
                      <div className={style.poolValue}>
                        <strong className="font-size-24">
                          {formatValue(pool.ticker_orig)}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={style.poolItem}>
                      <div className={style.poolLabel}>XRAY Rewards</div>
                      <div className={style.poolValue}>
                        <span className="icn mt-2">
                          <SVGCheckCircled />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={style.poolItem}>
                      <div className={style.poolLabel}>Live Stake</div>
                      <div className={style.poolValue}>
                        <strong>
                          {formatValue(
                            format(pool.total_stake / 1000000),
                            <sup> ADA</sup>
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={style.poolItem}>
                      <div className={style.poolLabel}>Fee Margin</div>
                      <div className={style.poolValue}>
                        <strong>{formatValue(pool.tax_ratio, "%")}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={style.poolItem}>
                      <div className={style.poolLabel}>Delegators</div>
                      <div className={style.poolValue}>
                        <strong>{formatValue(pool.delegators)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={style.poolItem}>
                      <div className={style.poolLabel}>Saturation</div>
                      <div className={style.poolValue}>
                        <strong>
                          {formatValue((pool.saturated * 100).toFixed(2), "%")}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={style.poolItem}>
                      <div className={style.poolLabel}>Blocks Lifetime</div>
                      <div className={style.poolValue}>
                        <strong>{formatValue(pool.blocks_lifetime)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={style.poolItem}>
                      <div className={style.poolLabel}>Blocks in Epoch</div>
                      <div className={style.poolValue}>
                        <strong>{formatValue(pool.blocks_epoch)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Button
                    href="https://app.raywallet.io/#/stake/"
                    target="_blank"
                    rel="noopener noreferrer"
                    type="primary"
                    className={`ray__btn ray__btn--success ray__btn--small w-100 ${isSaturated && 'ray__btn--disabled'}`}
                  >
                    <strong>{isSaturated ? 'Saturated' : 'Delegate'}</strong>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Pools
