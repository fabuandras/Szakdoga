import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Kezdőlap</h1>
      {user ? (
        <p>Üdvözölünk, <strong>{user.email}</strong>!</p>
      ) : (
        <p>Kérjük, jelentkezzen be vagy regisztráljon!</p>
      )}
    </div>
  );
}