import React from "react"
import { Table } from "../table"

interface ReviewsCardProps {
  data: any[]
  statusText?: string
  badgeType?: "warning" | "success" | "error"
  tableHeader: any
}

const ReviewsCard: React.FC<ReviewsCardProps> = ({ data, tableHeader }) => (
  <Table tableHeader={tableHeader} body={data} />
)

export default ReviewsCard
