import api from "./api/axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api
      .get("/auth/profile", { withCredentials: true })
      .then(({ data }) => {
        console.log("Profile response:", data);
        setUser(data);
        setReady(true);
      })
      .catch(() => {
        setUser(null);
        setReady(true);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
