import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import { AUTH_TOKEN_KEY } from "@/constants/config";

/**
 * Stockage du jeton Sanctum.
 *
 * expo-secure-store n'existe pas sur le web (Keychain iOS / Keystore Android) :
 * on retombe sur localStorage, uniquement pour permettre les tests dans le
 * navigateur pendant le développement. L'app cible est mobile.
 */
const webStorage = {
  async get(key: string) {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  },
  async set(key: string, value: string) {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  },
  async remove(key: string) {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  },
};

const nativeStorage = {
  get: (key: string) => SecureStore.getItemAsync(key),
  set: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  remove: (key: string) => SecureStore.deleteItemAsync(key),
};

const storage = Platform.OS === "web" ? webStorage : nativeStorage;

export const tokenService = {
  get: () => storage.get(AUTH_TOKEN_KEY),
  set: (token: string) => storage.set(AUTH_TOKEN_KEY, token),
  clear: () => storage.remove(AUTH_TOKEN_KEY),
};
