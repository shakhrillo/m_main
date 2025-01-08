import React from "react";
import { useFirebase } from "../contexts/FirebaseProvider";

const Security: React.FC = () => {
  const { user } = useFirebase();
  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h4>How to change password?</h4>
          <p>
            To change password, go to the Account page and click the change
            password button.
          </p>
          <h4>How to delete account?</h4>
          <p>
            To delete account, go to the Account page and click the delete
            account button.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Security;
