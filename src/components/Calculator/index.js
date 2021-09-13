import React, { useState, useEffect } from "react"
import { Input } from "antd"
import { useSelector } from "react-redux"
import { format } from "@/utils"
import * as style from "./style.module.scss"

const Calculator = () => {
  const prices = useSelector((state) => state.settings.prices)
  const pools = useSelector((state) => state.settings.pools)
  const [amount, setAmount] = useState(undefined)
  const [totalAda, setTotalAda] = useState(0)
  const [totalRay, setTotalRay] = useState(0)

  const rate = pools?.nextRate

  useEffect(() => {
    setTotalAda(amount * 0.05 || 0)
    setTotalRay((amount / (rate / 1000000)) * 73 || 0)
  }, [amount, rate])

  return (
    <div>
      <h5 className="mb-4">
        Current Price
      </h5>
      <div className="row">
        <div className="col-12 col-md-4">
          <div className="ray__card">
            <div className="ray__card__title">ADA Price</div>
            <div className="ray__card__amount">
              <span className="me-2">
                ${format(prices?.cardano?.usd || 0, 2)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="ray__card">
            <div className="ray__card__title">BTC Price</div>
            <div className="ray__card__amount">
              <span className="me-2">
                ${format(prices?.bitcoin?.usd || 0)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="ray__card">
            <div className="ray__card__title">XRAY Price</div>
            <div className="ray__card__amount">
              <span className="me-2">
                —
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="ray__card">
        <div className="ray__card__title mb-3">Enter ADA amount...</div>
        <div className="mb-4">
          <Input
            value={amount}
            onChange={({ target: { value } }) => setAmount(value)}
            placeholder="0.000000 ADA"
            size="large"
          />
        </div>
        <div className={style.performance}>
          <div className="row">
            <div className="col-md-6">
              <ul>
                <li>
                  ADA ROI:{" "}
                  <strong>
                    ~ 5% / Year
                  </strong>
                </li>
              </ul>
              <ul className="mb-4 mb-md-0">
                <li>
                  Year Returns:{" "}
                  <strong>
                    {format(totalAda, 2)}{" "}
                    <span className="ray__ticker ray__ticker__sm">ADA</span>
                  </strong>{" "}
                  <sup>{format(totalAda * (prices?.cardano?.usd || 0), 2)}$</sup>
                </li>
                <li>
                  Month Returns:{" "}
                  <strong>
                    {format(totalAda / 12, 2)}{" "}
                    <span className="ray__ticker ray__ticker__sm">ADA</span>
                  </strong>{" "}
                  <sup>{format((totalAda / 12) * (prices?.cardano?.usd || 0),  2)}$</sup>
                </li>
                <li>
                  Epoch Returns:{" "}
                  <strong>
                    {format(totalAda / 73, 2)}{" "}
                    <span className="ray__ticker ray__ticker__sm">ADA</span>
                  </strong>{" "}
                  <sup>{format((totalAda / 73) * (prices?.cardano?.usd || 0), 2)}$</sup>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul>
                <li>
                  XRAY Rate: {" "}
                  <strong>
                    {rate / 1000000} <span className="ray__ticker ray__ticker__sm">ADA</span> / 1{" "}
                    <span className="ray__ticker ray__ticker__sm">XRAY</span> / Epoch
                  </strong>
                </li>
              </ul>
              <ul className="mb-0">
                <li>
                  Year Returns:{" "}
                  <strong>
                    {format(totalRay)} <span className="ray__ticker ray__ticker__sm">XRAY</span>
                  </strong>{" "}
                </li>
                <li>
                  Month Returns:{" "}
                  <strong>
                    {format(totalRay / 12)}{" "}
                    <span className="ray__ticker ray__ticker__sm">XRAY</span>
                  </strong>{" "}
                </li>
                <li>
                  Epoch Returns:{" "}
                  <strong>
                    {format(totalRay / 73)}{" "}
                    <span className="ray__ticker ray__ticker__sm">XRAY</span>
                  </strong>{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator
