import { useQueriesMutation } from "@/lib/hooks/useQueriesMutation";
import { createContext } from "react";

export const ProfileContext = createContext({});

export function ProfileContextProvider({ children, ...props }) {
  const { data } = useQueriesMutation({ prefixUrl: "/user/me" });

  return (
    <ProfileContext.Provider value={data?.data} {...props}>
      {children}
    </ProfileContext.Provider>
  );
}
