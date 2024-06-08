import "@/styles/globals.css";
import { AppPropsWithLayout } from "@/types/next";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: React.ReactElement) => page);

  const renderComponent = () => {
    return getLayout(<Component {...pageProps} />);
  };

  return renderComponent();
}
