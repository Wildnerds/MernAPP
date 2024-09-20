import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { baseURL } from "app/api/client";
import useAuth from "./useAuth";
import asyncStorage, { KEYS } from "@utils/asyncStorage";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { useDispatch } from "react-redux";
import { updateAuthState } from "app/store/stateAuth";

// Create axios client instance
const authClient = axios.create({ baseURL });

type Response = {
  tokens: {
    refresh: string;
    access: string;
  };
};

const useClient = () => {
  const { authState } = useAuth();
  const dispatch = useDispatch();
  const token = authState.profile?.accessToken;

  // Axios request interceptor for attaching token
  authClient.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization && token) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Refresh logic to handle expired tokens
  const refreshAuthLogic = async (failedRequest: any) => {
    try {
      // Read refresh token from async storage
      const refreshToken = await asyncStorage.get(KEYS.REFRESH_TOKEN);

      // Request new access and refresh tokens
      const options = {
        method: "POST",
        data: { refreshToken }, // Ensure that API expects { refreshToken }
        url: `${baseURL}/auth/refresh-token`,
      };
      const res = await runAxiosAsync<Response>(axios(options));

      if (res?.tokens) {
        // Update the failed request with the new access token
        failedRequest.response.config.headers.Authorization =
          "Bearer " + res.tokens.access;

        // Save new tokens to async storage
        await asyncStorage.save(KEYS.AUTH_TOKEN, res.tokens.access);
        await asyncStorage.save(KEYS.REFRESH_TOKEN, res.tokens.refresh);

        // Dispatch updated auth state
        dispatch(
          updateAuthState({
            profile: { ...authState.profile!, accessToken: res.tokens.access },
            pending: false,
          })
        );

        // Resolve the failed request with the new access token
        return Promise.resolve();
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      return Promise.reject(error);
    }
  };

  // Attach auth refresh interceptor to axios
  createAuthRefreshInterceptor(authClient, refreshAuthLogic);

  return { authClient };
};

export default useClient;
