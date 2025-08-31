
import { INewUser, IUser } from "../interfaces/IUser";

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const CLIENTS = 'CLIENTS';
export const CLIENT = 'CLIENT';
export const USERS = 'USERS';
export const ADD_CLIENT = "ADD_CLIENT"
export const TREATMENTS = "TREATMENTS"
export const STAFF = "STAFF"
export const APPOINTMENTSME = "APPOINTMENTSME"

export const url = import.meta.env.VITE_URL

export type ClientAction = {
    type: "CLIENTS" 
    payload?: IUser[] 
};

export type ClientMeAction = {
    type: "CLIENT" 
    payload?: IUser 
};


export type NewClientAction = {
    type: "ADD_CLIENT"
    payload?:  INewUser
};

export type UserAction = {
    type: "USERS"
    payload?: IUser 
};

  export type ToggleSidebarAction = {
    type: 'TOGGLE_SIDEBAR';
};

export const toggleSidebar = (): ToggleSidebarAction => ({
  type: TOGGLE_SIDEBAR,
});

export type SidebarActions = ToggleSidebarAction;

// export const notify = (str: string) => {
//     toast.success(str, {
//             position: "bottom-right",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: false,
//             draggable: true,
//             progress: undefined,
//             theme: "light",
//             transition: Bounce,
//             }
//     )
// }

// export const notifyErr = (str: string) => {
//     toast.error(str, {
//             position: "bottom-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "light",
//             transition: Bounce,
//             }
//     )
// }