import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function ProfileIndexPage() {
  const locale = await getLocale();
  redirect({ href: "/profile/folders", locale });
}
