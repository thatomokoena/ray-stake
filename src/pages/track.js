import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import Breadcrumbs from "@/components/Breadcrumbs"
import Track from "@/components/Track"

const Page = () => {
  return (
    <MainLayout>
      <Helmet title="Rewards Tracking" />
      <Breadcrumbs title="Track & Withdraw Rewards" />
      <Track />
    </MainLayout>
  )
}

export default Page
