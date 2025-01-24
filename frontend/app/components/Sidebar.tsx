import { Logo } from "../../iconSvgs/Logo";
import { Twitter } from "../../iconSvgs/Twitter";
import { Youtube } from "../../iconSvgs/Youtube";
import { SidebarElement } from "./SidebarElement";

export function Sidebar() {
  return (
    <div className="h-screen bg-white border-r w-72 fixed left-0 top-0 pl-6">
      <div className="flex text-2xl pt-8 items-center">
        <div className="pr-2 text-purple-600">
          <Logo />
        </div>
        Chamber of Secrets
      </div>
      <div className="pt-8 pl-4">
        <SidebarElement text="Twitter" icon={<Twitter />} />
        <SidebarElement text="Youtube" icon={<Youtube />} />
      </div>
    </div>
  );
}
