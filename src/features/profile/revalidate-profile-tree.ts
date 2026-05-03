import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";

/** Invalidate cached profile subtree (folders, notes, editor parents) after mutations. */
export function revalidateProfileTree() {
  for (const loc of routing.locales) {
    const profilePath =
      loc === routing.defaultLocale ? "/profile" : `/${loc}/profile`;
    revalidatePath(profilePath, "layout");
  }
}
