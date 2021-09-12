import React from "react"
import { useSelector } from "react-redux"
import { format } from "@/utils"
import ChartSchedule from "@/components/ChartSchedule"

const Dashboard = () => {
  const pools = useSelector((state) => state.settings.pools)
  const history = useSelector((state) => state.settings.history)

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
      <h5 className="mt-4 mb-4">
        {history?.lastSynced && `XRAY Epoch ${history?.lastSynced?.epoch} Payouts (For Epoch ${history?.lastSynced?.epoch - 2})`}
        {!history?.lastSynced && `Current Epoch Payouts`}
      </h5>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="ray__card">
            <div className="ray__card__title">XRAY Payouts</div>
            <div className="ray__card__amount">
              <span className="me-2">
                {format(history?.lastSynced?.accrued || 0)}
              </span>
              <span className="ray__ticker ray__ticker__lg">XRAY</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="ray__card">
            <div className="ray__card__title">XRAY Epoch Limit</div>
            <div className="ray__card__amount">
              <span className="me-2">
                {format(history?.lastSynced?.max || 0)}
              </span>
              <span className="ray__ticker ray__ticker__lg">XRAY</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="ray__card">
            <div className="ray__card__title">Rewards Rate</div>
            <div className="ray__card__amount">
              <span>{format(history?.lastSynced?.rate / 1000000 || 0)}</span>
              <span className="ray__card__amount__small me-2">.{(history?.lastSynced?.rate / 1000000 || 0).toString().split(".")[1] || '000000'}</span>
              <span className="ray__ticker ray__ticker__lg">ADA</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="ray__card">
            <div className="ray__card__title">Active Stake Snapshot</div>
            <div className="ray__card__amount">
              <span className="me-2">
                {format(history?.lastSynced?.snapshot / 1000000 || 0)}
              </span>
              <span className="ray__ticker ray__ticker__lg">ADA</span>
            </div>
          </div>
        </div>
      </div>
      <h5 className="mt-4 mb-4">
        XRAY Distribution Schedule
      </h5>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="ray__card">
            <div className="ray__card__title">Total Distributed</div>
            <div className="ray__card__amount">
              <span className="me-2">
                {format(history?.totalAccrued || 0)}
              </span>
              <span className="ray__ticker ray__ticker__lg">XRAY</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="ray__card">
            <div className="ray__card__title">Undelivered</div>
            <div className="ray__card__amount">
              <span className="me-2">
                {format(history?.totalUndelivered || 0)}
              </span>
              <span className="ray__ticker ray__ticker__lg">XRAY</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="ray__card ray__card--last">
            <div className="ray__card__title">Distribution Schedule</div>
            <div>
              <ChartSchedule history={history?.distributionHistory || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
