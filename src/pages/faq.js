import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import Breadcrumbs from "@/components/Breadcrumbs"
import Faq from "@/components/Faq"

const Page = () => {
  return (
    <MainLayout>
      <Helmet title="FAQ" />
      <Breadcrumbs title="FAQ" />
      <Faq />
    </MainLayout>
  )
}

export default Page
