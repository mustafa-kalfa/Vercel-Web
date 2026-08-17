import { redirect } from "next/navigation";

// Var olmayan her adres /su-anda-buradasiniz'a gidiyor (Mustafa'nin istegi,
// 2026-08-17). Next.js'in ontanimli siyah-beyaz "404 | This page could not
// be found" ekrani artik hic gorunmuyor.
export default function NotFound() {
  redirect("/su-anda-buradasiniz");
}
