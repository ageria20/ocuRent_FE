import { Dispatch } from "@reduxjs/toolkit"
import { CLIENT, ClientMeAction, url, UserAction, USERS } from "../action"



export const getUser = (setIsLoading: (b: boolean) => void) => {
    return async (dispatch: Dispatch<UserAction>) => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken"); 
        if (!accessToken) {
          console.log("Login errato");
          return;
        }
        const resp = await fetch(`${url}/users/me`, {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });
  
        if (resp.ok) {
          const user = await resp.json();
          dispatch({ type: USERS, payload: user });
          setIsLoading(false);
        } else {
          console.log("Errore nel fetch dell'utente");
        }
      } catch (error) {
        console.log(error);
      } 
    };
  };