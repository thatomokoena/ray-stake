import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import Breadcrumbs from "@/components/Breadcrumbs"
import Calculator from "@/components/Calculator"

const Page = () => {
  return (
    <MainLayout>
      <Helmet title="Calculator" />
      <Breadcrumbs title="Calculator" />
      <Calculator />
    </MainLayout>
  )
}

export default Page
