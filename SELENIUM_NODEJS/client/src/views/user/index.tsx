import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteAccountAction, updateAccountPasswordAction } from "../../features/auth/action";

function UsersView() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {}, []);

  return (
    <div className="container">
      <h1>User</h1>
      <div>
        <p>
          <strong>Balance: </strong> 
          <span className="badge bg-primary">
            {user?.balance || 0} seconds
          </span>
        </p>
        <hr />
        <p>
          <strong>UID:</strong> {user?.uid}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <hr />

        <h5>User form</h5>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" disabled placeholder={user?.email} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" />
          </div>
          <button type="submit" className="btn btn-primary" onClick={(e) => {
            dispatch(updateAccountPasswordAction({ password: (document.getElementById('password') as HTMLInputElement).value }));
          }}>
            Change password
          </button>
        </form>

        <hr />

        <h5>Delete account</h5>
        <button className="btn btn-danger" onClick={() => {
          dispatch(deleteAccountAction());
        }}>
          Delete account
        </button>

      </div>
    </div>
  );
}

export default UsersView;