// /env.ts
export const getEnv = () => {
    const config = useRuntimeConfig()
  
    return {
      nodeEnv: config.public.NODE_ENV as string,
      firebaseApiKey: config.public.FIREBASE_API_KEY as string,
      firebaseProjectId: config.public.FIREBASE_PROJECT_ID as string,
      firebaseAuthDomain: config.public.FIREBASE_AUTH_DOMAIN as string,
      getEncryptionKey : config.public.ENCRYPTION_KEY as string,
      getEncryptionIv : config.public.ENCRYPTION_IV as string,
    }
  }
  
export const getNodeEnv = () => getEnv().nodeEnv
export const getFirbaseProjectId = () => getEnv().firebaseProjectId
export const getEncryptionKey = () => getEnv().getEncryptionKey
// export const getProjectSalt = () => getEnv().getProjectSalt