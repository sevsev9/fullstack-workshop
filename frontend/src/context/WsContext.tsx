import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY, getLocalStorageItem } from "@/utils/localstorage";
import { useRouter } from "next/router";
import { LOGIN_PAGE } from "@/utils/pages";
import type { User } from "../../../backend/src/model/user.model";
import {
  WSLobby,
  Request,
  Response,
} from "../../../backend/src/types/ws.types";

type WsContextType = {
  lobbies: WSLobby[];
  sendWsMessage: (message: Request) => void;
};

const WsContext = createContext<WsContextType>({
  lobbies: [],
  sendWsMessage: () => {},
});

export default function WsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lobbies, setLobbies] = useState<WSLobby[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const url = "http://localhost:8080";

  useEffect(() => {
    const ws = new WebSocket(
      url,
      getLocalStorageItem(ACCESS_TOKEN_KEY) ?? undefined,
    );

    ws.onmessage = (message) => {
      try {
        const response = JSON.parse(message.data) as Response;

        switch (response.type) {
          case "error":
            toast(response.payload.error);
            router.push(LOGIN_PAGE);
          case "lobby_list":
            console.log(response.payload.lobbies);
          case "lobby_create":
            console.log(response.payload);
          default:
            toast("unknown event response");
        }
      } catch (e) {}
    };

    ws.onopen = () => {
      setIsOpen(true);
      setLoading(false);
    };

    ws.onerror = () => {
      setIsOpen(false);
      setLoading(false);
    };

    ws.onclose = () => {
      setIsOpen(false);
      setLoading(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []); /* eslint-disable-line */

  const sendWsMessage = (request: Request) => {
    if (socket && isOpen) {
      socket.send(JSON.stringify(request));
    } else {
      toast("WebSocket is not open");
    }
  };

  if (loading) return null;

  return (
    <WsContext.Provider
      value={{
        lobbies,
        sendWsMessage,
      }}
    >
      {children}
    </WsContext.Provider>
  );
}

export function useWsContext() {
  const { lobbies, sendWsMessage } = useContext(WsContext);

  return {
    lobbies,
    sendWsMessage,
  };
}
