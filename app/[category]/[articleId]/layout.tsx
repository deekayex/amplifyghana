import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function ArticleLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
