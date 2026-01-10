
import  {Footer}  from "@/features/home/footer";
import  {Header}  from "@/features/home/header";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
// import { usePathname } from "next/navigation";

export const metadata: Metadata = {
    title: {
        template: "Editor ",
        default: "Code Editor",
    },
};
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* BACKGROUND GRID */}
      <div
        className={cn(
          "fixed inset-0 -z-10",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />

      {/* MASK LAYER */}
      <div className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      <Header />

      <main className="relative z-20 w-full">
        {children}
      </main>

      <Footer />
    </>
  );
}
