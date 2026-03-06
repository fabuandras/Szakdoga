import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Profilom</h1>
      {user && (
        <p>Üdvözöllek, <strong>{user.felhasznalonev}</strong>!</p>
      )}
    </div>
  );
}
