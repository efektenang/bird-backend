interface ICacheToken {
  gateway: { SERVICE_ID: string; ROUTE_ID: number; PATH: string; METHOD: string; };
  }
  
  const cacheToken = {
    gateway: "GATEWAY@$SERVICE_ID:$ROUTE_ID:$PATH:$METHOD"
  };
  
  export default function getCacheToken<T extends keyof typeof cacheToken>(
    obj: keyof typeof cacheToken,
    params: ICacheToken[T] | {} = {}
  ) {
    return cacheToken[obj].replace(
      /\$+[a-zA-Z0-9_-]+/g,
      (m) => params[m.replace(/[^a-zA-Z0-9_-]+/g, "")]
    );
  }
  