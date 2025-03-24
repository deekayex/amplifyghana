import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Amplify Ghana",
};

export default async function AboutLayout({ children }) {
  return <>{children}</>;
}
