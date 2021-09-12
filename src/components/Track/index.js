import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import store from "store"
import QRCode from "qrcode.react"
import { Table, message, Input, Button, Statistic, Tooltip, Alert } from "antd"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { SVGClose, SVGAdd, SVGFiles, SVGCheckCircled, SVGReload, SVGAddCircled, SVGCloseCircled } from "@/svg"
import { addDays } from "date-fns"
import Confetti from 'react-confetti'
import { format, truncate } from "@/utils"
import { getKeyHistory, getKeyOrders, getKeyPayouts, getKeyAdaHistory } from "@/services/distr"
import ChartTrackXray from "@/components/ChartTrackXray"
import ChartTrackAda from "@/components/ChartTrackAda"
import * as style from "./style.module.scss"

const orderColumns = [
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (record) => (
      <strong
        className={`
          ${record === 'completed' && 'text-success'}
          ${record === 'processing' && 'text-success'}
          ${record === 'pending' && 'text-success'}
        `}
      >
        {record}
      </strong>
    ),
  },
  {
    title: "Ada Received",
    dataIndex: "value",
    key: "value",
    render: (record) => <span>{format(record / 1000000)} <span className="ray__ticker ray__ticker__sm ms-1">ADA</span></span>,
  },
  {
    title: "Tx Hash",
    dataIndex: "hash",
    key: "hash",
    render: (record) => <span><a href={`https://cardanoscan.io/transaction/${record}`} target="_blank" rel="noopener noreferrer">{truncate(record)}</a></span>,
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (record) => <span>{record}</span>,
  },
]

const payoutColumns = [
  {
    title: "Paid",
    dataIndex: "paid",
    key: "paid",
    render: (record) => <strong>{format(record)} <span className="ray__ticker ray__ticker__sm ms-1">XRAY</span></strong>,
  },
  {
    title: "Tx Hash",
    dataIndex: "hash",
    key: "hash",
    render: (record) => <span><a href={`https://cardanoscan.io/transaction/${record}`} target="_blank" rel="noopener noreferrer">{truncate(record)}</a></span>,
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (record) => <span>{record}</span>,
  },
]

const Track = () => {
  const theme = useSelector((state) => state.settings.theme)
  const networkState = useSelector((state) => state.settings.networkState)
  const [keys, setKeys] = useState(store.get("app.track.keys") || [])
  const [address, setAddress] = useState(keys[0] || "")
  const [findAddress, setFindAddress] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  const [history, setHistory] = useState({})
  const [adaRewards, setAdaRewards] = useState({})
  const [orders, setOrders] = useState([])
  const [payouts, setPayouts] = useState([])

  const withdrawalAddress = "addr1q9gfz2dpdvev0yvnph2jgdh5ugwrfq0mnm5gzl972q0gxpvxdtxynggtwq540uzww6p66ezxkwa7w9snynphc36kuqesxk56gx"
  const keysNotEmpty = keys.length > 0 

  const lookupAddress = async () => {
    if (findAddress) {
      if (findAddress.startsWith('addr1') || findAddress.startsWith('stake1')) {
        const result = await getKeyHistory(findAddress)
        if (result?.data?.key) {
          message.success("Stake key added")
          setAndFetch(result?.data?.key, true)
        } else {
          message.error("Something went wrohg. Try again later")
        }
      } else {
        message.error("Enter a valid address or stake key")
      }
    } else {
      message.error("Enter a valid address or stake key")
    }
  }

  const setAndFetch = (key, add = false) => {
    setHistory({})
    setAdaRewards({})
    setOrders([])
    setPayouts([])

    setFindAddress("")
    setAddress(key)
    setShowAdd(false)
    fetchData(key)
    if (add) {
      const newKeys = [...keys, key]
      store.set("app.track.keys", newKeys)
      setKeys(newKeys)
    }
  }

  const fetchData = async (key) => {
    setLoading(true)
    const ada = await getKeyAdaHistory(key)
    const history = await getKeyHistory(key)
    const orders = await getKeyOrders(key)
    const payouts = await getKeyPayouts(key)
    setAdaRewards(ada?.data || {})
    setHistory(history?.data || {})
    setOrders(orders?.data || {})
    setPayouts(payouts?.data || {})
    setLoading(false)
  }

  const updateOrders = async () => {
    setOrdersLoading(true)
    await getKeyOrders(address)
    await getKeyPayouts(address)
    setOrdersLoading(false)
  }

  useEffect(() => {
    if (keys.length > 0) {
      setAndFetch(keys[0])
    }
    // eslint-disable-next-line
  }, [])

  const removeItem = (key) => {
    if (keys.length < 2) {
      setHistory({})
      setOrders([])
      setPayouts([])
      setKeys([])
      store.remove("app.track.keys")
    } else {
      const index = keys.indexOf(key)
      const newKeys = [...keys]
      newKeys.splice(index, 1)
      setKeys(newKeys)
      store.set("app.track.keys", newKeys)
      setAndFetch(newKeys[0])
    }
  }

  const hasPayouts = payouts[0] && payouts[0].total > 0
  const totalPayoutsAmount = payouts[0] ? payouts[0].payouts?.reduce((acc, payout) => acc + payout.paid, 0) : 0 

  const totalAdaRewards = adaRewards?.rewards?.filter((r) => r.earnedIn.number !== (networkState?.currentEpoch?.number - 1))
    .reduce((acc, r) => acc + parseInt(r.amount), 0) || 0
  const totalAdaWithdrawals = adaRewards?.withdrawals?.reduce((acc, r) => acc + parseInt(r.amount), 0) || 0
  const currentAdaBalance = totalAdaRewards - totalAdaWithdrawals

  return (
    <div>
      <div>
        {keysNotEmpty && (
          <div className="mb-4 text-wrap">
            {keys.map((key, index) => {
              return (
                <span
                  key={index}
                  className={`${style.stakeLink} ${!showAdd && address === key && style.stakeLinkActive
                    }`}
                  onClick={() => setAndFetch(key)}
                  onKeyPress={() => setAndFetch(key)}
                  role="button"
                  tabIndex="0"
                >
                  {truncate(key)}{" "}
                </span>
              )
            })}
            <span
              className={`${style.stakeLink} ${showAdd && style.stakeLinkActive}`}
              onClick={() => setShowAdd(true)}
              onKeyPress={() => setShowAdd(true)}
              role="button"
              tabIndex="0"
            >
              <span className="icn">
                <SVGAdd />
              </span>
            </span>
          </div>
        )}
      </div>
      <div>
        {(!keysNotEmpty || showAdd) && (
          <div className="ray__card ray__card--last">
            <div className={style.addWallet}>
              <span className={`${style.addWalletIcon} icn mb-3`}>
                <SVGAddCircled />
              </span>
              <h3 className="mb-2 text-inverse">
                <strong>Add Wallet To Tracking</strong>
              </h3>
              <p className="mb-5">
                Enter your any used wallet address (addr1…) or stake key (stake1…) below
              </p>
              <div className="mb-5">
                <Input
                  value={findAddress}
                  className="text-center"
                  placeholder="addr1... or stake1..."
                  size="large"
                  onChange={(e) => setFindAddress(e.target.value)}
                />
              </div>
              <div>
                <Button
                  className="ray__btn ray__btn--round"
                  onClick={lookupAddress}
                >
                  <span className="icn me-2">
                    <SVGAdd />
                  </span>
                  <span>Add Wallet</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {(keysNotEmpty && !showAdd) && (
          <div>
            <div>
              <span
                className="ms-4 float-end text-primary"
                onClick={() => removeItem(address)}
                onKeyPress={() => removeItem(address)}
                role="button"
                tabIndex="0"
              >
                <span className="icn icn-fix icn-primary">
                  <SVGClose />
                </span>
                <span className="ms-1">Remove</span>
              </span>
              <h5 className="mb-0">
                Rewards Statistics
              </h5>
            </div>
            <h2 className="mb-4">
              <CopyToClipboard
                text={address}
                onCopy={() => message.success("Copied to clipboard")}
              >
                <Tooltip title="Copy to clipboard">
                  <span className="text-primary cursor-pointer">
                    <span className="me-2 text-break">
                      <strong className="text-inverse text-wrap">{truncate(address, 12)}</strong>
                    </span>
                    <span className="icn icn-lg icn-fix icn-primary">
                      <SVGFiles />
                    </span>
                  </span>
                </Tooltip>
              </CopyToClipboard>
            </h2>
            {!loading && !history.found && (
              <Alert
                className="mb-4"
                message="Your stake is not yet matured. You must wait 2 epochs after delegation to start accruing XRAY rewards."
                type="warning"
                showIcon
              />
            )}
            <div className="row">
              <div className="col-12 col-md-12">
                <div className={`ray__card ${style.diamond}`}>
                  <Confetti
                    width={1000}
                    height={150}
                  />
                  <div className="d-flex">
                    <img src="/resources/XDIAMOND.png" alt="XDIAMOND" />
                    <div>
                      <div className="ray__card__title">
                        Early Delegator Bonus (End in Epoch 275)
                      </div>
                      <div className="ray__card__amount">
                        <span className="me-2">
                          {format(history?.bonus || 0)}
                        </span>
                        <span className="ray__ticker ray__ticker__lg">XDIAMOND</span>
                      </div>
                      <div className="d-flex">
                        <div>
                          {!loading && hasPayouts && !!history?.bonus && (
                            <span className="ray__card__status">
                              <span className="icn icn-success icn-fix me-1">
                                <SVGCheckCircled />
                              </span>
                              Paid
                            </span>
                          )}
                          {!loading && !hasPayouts && !!history?.bonus && (
                            <span className="ray__card__status">
                              <span className="icn icn-success icn-fix me-1">
                                <SVGCheckCircled />
                              </span>
                              Ready
                            </span>
                          )}
                          {!loading && !history?.bonus && (
                            <span className="ray__card__status">
                              <span className="icn icn-success icn-fix me-1">
                                <SVGCloseCircled />
                              </span>
                              Not registered
                            </span>
                          )}
                        </div>
                        <div className={style.diamondBuy}>
                          <a
                            href="https://xdiamond.rraayy.com"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <strong>Buy XDIAMOND &rarr;</strong>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="ray__card">
                  <div className="ray__card__title">XRAY Rewards Balance</div>
                  <div className="ray__card__amount">
                    <span className="me-2">
                      {format((history?.totalAccrued || 0) - totalPayoutsAmount)}
                    </span>
                    <span className="ray__ticker ray__ticker__lg">XRAY</span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="ray__card">
                  <div className="ray__card__title">ADA Rewards Balance</div>
                  <div className="ray__card__amount">
                    <span>{format(currentAdaBalance / 1000000 || 0)}</span>
                    <span className="ray__card__amount__small me-2">.{(currentAdaBalance / 1000000 || 0).toString().split(".")[1] || '000000'}</span>
                    <span className="ray__ticker ray__ticker__lg">ADA</span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="ray__card">
                  <div className="ray__card__title">Next Rewards</div>
                  <div className="ray__card__amount">
                    <Statistic.Countdown
                      className="ray__count__inline"
                      value={addDays(new Date(networkState?.currentEpoch?.startedAt || null), 5)}
                      format="D[d] HH[h] mm[m] ss[s]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="ray__card">
                  <div className="ray__card__title">Total {format(history?.totalAccrued || 0)} XRAY</div>
                  <div>
                    <ChartTrackXray history={history?.distributionHistory || []} />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="ray__card">
                  <div className="ray__card__title">Total {format(totalAdaRewards / 1000000 || 0, 6)} ADA</div>
                  <div>
                    <ChartTrackAda history={adaRewards?.rewards || []} epochCut={networkState?.currentEpoch?.number - 1} />
                  </div>
                </div>
              </div>
            </div>
            <h5 className="mt-4 mb-4">
              XRAY Withdrawals
            </h5>
            <div className="row">
              <div className="col-12">
                <div className="ray__card">
                  <div className={style.redeem}>
                    <div className={style.redeemQr}>
                      <QRCode
                        value={withdrawalAddress}
                        size={400}
                        bgColor={theme === "default" ? "#fff" : "#000"}
                        fgColor={theme === "default" ? "#000" : "#fff"}
                      />
                    </div>
                    <div className={style.redeemInfo}>
                      <p>
                        <strong>
                          Send 2 ADA from wallet you delegated to the address below.
                        </strong>{" "}
                      </p>
                      <p>
                        You will receive back ~1.5 ADA and accrued XRAY tokens shortly (~3-6 minutes).
                        <br />
                        Please send the <strong>exact</strong> amount of 2 ADA!
                      </p>
                      <p className="mb-4 mb-md-0">
                        <CopyToClipboard
                          text={withdrawalAddress}
                          onCopy={() => message.success("Copied to clipboard")}
                        >
                          <Tooltip title="Copy to clipboard">
                            <span className="text-primary cursor-pointer">
                              <span className="me-1 text-break">
                                {withdrawalAddress}
                              </span>
                              <span className="icn icn-fix icn-primary">
                                <SVGFiles />
                              </span>
                            </span>
                          </Tooltip>
                        </CopyToClipboard>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="ray__card">
                  {ordersLoading && <div className="spinner-border spinner-border-sm text-primary" />}
                  {!ordersLoading && (
                    <span
                      className="ray__card__status text-primary cursor-pointer"
                      onClick={() => updateOrders(true)}
                      onKeyPress={() => updateOrders(true)}
                      role="button"
                      tabIndex="0"
                    >
                      <span className="icn icn-primary icn-fix icn-sm me-1">
                        <SVGReload />
                      </span>
                      <span>Update</span>
                    </span>
                  )}
                  <div className="ray__card__title">Recent Orders</div>
                  <div className="ray__table">
                    <Table rowKey="hash" dataSource={orders[0] ? orders[0].orders : []} columns={orderColumns} pagination={false} />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="ray__card ray__card--last">
                  {ordersLoading && <div className="spinner-border spinner-border-sm text-primary" />}
                  {!ordersLoading && (
                    <span
                      className="ray__card__status text-primary cursor-pointer"
                      onClick={() => updateOrders(true)}
                      onKeyPress={() => updateOrders(true)}
                      role="button"
                      tabIndex="0"
                    >
                      <span className="icn icn-primary icn-fix icn-sm me-1">
                        <SVGReload />
                      </span>
                      <span>Update</span>
                    </span>
                  )}
                  <div className="ray__card__title">Recent Payouts</div>
                  <div className="ray__table">
                    <Table rowKey="hash" dataSource={payouts[0] ? payouts[0].payouts : []} columns={payoutColumns} pagination={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Track
