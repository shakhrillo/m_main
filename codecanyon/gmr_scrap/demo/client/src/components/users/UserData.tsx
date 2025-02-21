import { NavLink } from "react-router-dom";
import { IUserInfo } from "../../types/userInfo";
import { Badge, Stack, Image } from "react-bootstrap";
import { formatNumber, formatTimestamp } from "../../utils";

export const UserData = ({ user }: { user: IUserInfo }) => {
  return (
    <div className="user-data">
      <div className="d-block">
        <Image src={user.photoURL} alt={user.uid} width={50} className="rounded-circle" />
      </div>

      <div className="w-100 ms-3">
        <Stack direction="horizontal" gap={2} className="justify-content-between">
          <Badge bg="primary" className="text-capitalize">
            {`${formatNumber(user.coinBalance)} coins`}
          </Badge>
          {formatTimestamp(user.createdAt)}
        </Stack>
        <NavLink className={"h6"} to={`/users/${user.uid}`}>
          {user.email}
        </NavLink>
        <Stack direction="horizontal" gap={2} className="text-muted">
          <div>Images: {formatNumber(user.totalImages)}</div>
          <div>OwnerReviews: {formatNumber(user.totalOwnerReviews)}</div>
          <div>Reviews: {formatNumber(user.totalReviews)}</div>
          <div>Spent: {formatNumber(user.totalSpent)}</div>
          <div>ValidateComments: {formatNumber(user.totalValidateComments)}</div>
          <div>ValidateInfo: {formatNumber(user.totalValidateInfo)}</div>
          <div>Videos: {formatNumber(user.totalVideos)}</div>
        </Stack>
      </div>

    </div>
  )
}