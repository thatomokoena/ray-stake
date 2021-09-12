import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import Breadcrumbs from "@/components/Breadcrumbs"
import Pools from "@/components/Pools"

const Page = () => {
  return (
    <MainLayout>
      <Helmet title="Staking Pools" />
      <Breadcrumbs title="Staking Pools" />
      <Pools />
    </MainLayout>
  )
}

export default Page
