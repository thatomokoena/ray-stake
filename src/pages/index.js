import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import Breadcrumbs from "@/components/Breadcrumbs"
import Dashboard from "@/components/Dashboard"

const Page = () => {
  return (
    <MainLayout>
      <Helmet title="Rewards Distribution" />
      <Breadcrumbs title="Rewards Distribution" />
      <Dashboard />
    </MainLayout>
  )
}

export default Page
