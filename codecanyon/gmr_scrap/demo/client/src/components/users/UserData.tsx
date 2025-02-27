import { NavLink } from "react-router-dom";
import { IUserInfo } from "../../types/userInfo";
import { Stack, Image } from "react-bootstrap";
import { formatNumber, formatTimestamp } from "../../utils";

export const UserData = ({ user }: { user: IUserInfo }) => {
  return (
    <div className="user-data">
      <div className="user-image">
        { user.photoURL && <Image src={user.photoURL} alt={user.uid} /> }
      </div>

      <Stack>
        <NavLink to={`/users/${user.uid}`}>{user.email}</NavLink>
        {
          user.isDeleted && (
            <div className="text-danger">Deleted</div>
          )
        }
        <Stack direction="horizontal" gap={2} className="user-stats">
          <div>Coins: {formatNumber(user.coinBalance)}</div>
          <div>Images: {formatNumber(user.totalImages)}</div>
          <div>OwnerReviews: {formatNumber(user.totalOwnerReviews)}</div>
          <div>Reviews: {formatNumber(user.totalReviews)}</div>
          <div>Spent: {formatNumber(user.totalSpent)}</div>
          <div>ValidateComments: {formatNumber(user.totalValidateComments)}</div>
          <div>ValidateInfo: {formatNumber(user.totalValidateInfo)}</div>
          <div>Videos: {formatNumber(user.totalVideos)}</div>
        </Stack>
      </Stack>
      <div className="user-time">
        {formatTimestamp(user.createdAt)}
      </div>
    </div>
  )
}