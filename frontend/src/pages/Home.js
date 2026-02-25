import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {user ? (
        <>
          <h1>Profilom</h1>
          <p>Üdvözöllek, <strong>{user.felhasznalonev}</strong>!</p>
        </>
      ) : (
        <>
          <h1>Kezdőlap</h1>
          <p>Kérjük, jelentkezzen be vagy regisztráljon!</p>
        </>
      )}
    </div>
  );
}