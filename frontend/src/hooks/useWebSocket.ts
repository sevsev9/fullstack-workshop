import { Response } from "@/types/ws.types";
import { ACCESS_TOKEN_KEY, getLocalStorageItem } from "@/utils/localstorage";
import { LOGIN_PAGE } from "@/utils/pages";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const ws = new WebSocket(
      url,
      getLocalStorageItem(ACCESS_TOKEN_KEY) ?? undefined,
    );

    ws.onmessage = (message) => {
      try {
        const response = JSON.parse(message.data) as Response;

        console.log(response.type);

        switch (response.type) {
          case "error":
            toast(response.payload.error);
            router.push(LOGIN_PAGE);
          default:
            toast("unknown event response");
        }
      } catch (e) {}
    };

    ws.onopen = () => {
      setIsOpen(true);
    };

    ws.onerror = () => {
      setIsOpen(false);
    };

    ws.onclose = () => {
      setIsOpen(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  return { isOpen };
};

export default useWebSocket;
