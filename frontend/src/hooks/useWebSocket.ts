import { Response, WSLobby, Request } from "@/types/ws.types";
import { ACCESS_TOKEN_KEY, getLocalStorageItem } from "@/utils/localstorage";
import { LOGIN_PAGE } from "@/utils/pages";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const useWebSocket = (url: string) => {
  const [lobbies, setLobbies] = useState<WSLobby[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const sendMessageToSocket = (request: Request) => {
    if (socket && isOpen) {
      socket.send(JSON.stringify(request));
    } else {
      toast("WebSocket is not open");
    }
  };

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
          case "lobby_list":
            console.log(response.payload.lobbies);
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

  return { isOpen, sendMessageToSocket };
};

export default useWebSocket;
