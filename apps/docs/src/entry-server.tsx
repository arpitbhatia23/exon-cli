import { renderToString } from "react-dom/server";
import App from "./App";
import { pageMetadata } from "./docsMetadata";

export { pageMetadata };

export function renderPage(pageId: string) {
  return renderToString(<App initialPage={pageId} />);
}
