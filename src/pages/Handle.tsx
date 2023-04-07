import { useLocation } from "react-router-dom";

export function Handle() {
  const { search } = useLocation();

  const mode = new URLSearchParams(search).get("mode");
  const oobCode = new URLSearchParams(search).get("oobCode");

  return (
    <>
      <p>{mode}</p>
      <p>{oobCode}</p>
    </>
  );
}
