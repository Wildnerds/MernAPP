
import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage, { KEYS } from "@utils/asyncStorage";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { getAuthState, updateAuthState } from "app/store/stateAuth";
import { useDispatch, useSelector } from "react-redux";


export interface SignInResPonse {
    profile: {
      id: string;
      email: string;
      name: string;
      verified: boolean;
      avatar?:  string
    };
    tokens: {
      access: string;
      refresh: string;
    };
}

type UserInfo =  {
    email: string;
    password: string;
}


const useAuth = () => {
    const dispatch = useDispatch()
    const authState = useSelector(getAuthState);
    
    const signIn = async (userInfo: UserInfo) => {
    dispatch(updateAuthState({profile: null, pending: true}))
    const res = await runAxiosAsync<SignInResPonse>
    (client.post("/auth/sign-in" , userInfo)) ;
        
        if(res){
          //store token here
          await asyncStorage.save(KEYS.AUTH_TOKEN,res.tokens.access)
          await asyncStorage.save(KEYS.REFRESH_TOKEN, res.tokens.refresh)
          // await  AsyncStorage.setItem("access_token", res.tokens.access)
          // await  AsyncStorage.setItem("refresh_token", res.tokens.access)
          dispatch(updateAuthState({profile:{ ...res.profile, 
            accessToken: res.tokens.access}, pending: false}))
        }
          else{
            dispatch(updateAuthState({profile: null, pending: false}))
          }
        }
        const loggedIn = authState.profile ? true : false;
        return {signIn, authState, loggedIn}
};

export default useAuth;