"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { useUser } from "../providers/user-provider";
import UserAvatar from "../party/user-avatar";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../../store/atoms";

export default function UserAccountDropDown() {
  const user = useUser();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const setUser = useSetRecoilState(userAtom);
  const signOut = () => {
    fetch(BACKEND_URL + "/auth/logout").then(() => {
      setUser((prev) => ({ ...prev, token: "" }));
      navigate("/");
    });
  };
  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-[2rem] flex items-center p-[0.2rem]  justify-center h-[2rem]">
            <UserAvatar
              url={user.avatarUrl}
              username={user.name}
              key={user.id}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="!w-[15rem] dark:shadow-[#030712] translate-y-8 scale-110 -translate-x-10 shadow-lg">
            <DropdownMenuLabel className="flex gap-4 items-center">
              <div className="!w-[2rem] flex items-center p-[0.2rem]  justify-center !h-[2rem]">
                <UserAvatar
                  url={user.avatarUrl}
                  username={user.name}
                  key={user.id}
                />
              </div>

              <div className="flex flex-col">
                <span className="max-w-[200px]">{user?.name}</span>
                <span className="text-[0.8rem] max-w-[200px] text-gray-400">
                  {user?.name}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user && (
              <DropdownMenuItem
                onClick={signOut}
                className=" flex gap-2 focus:bg-[#f34e4e]"
              >
                {/* <LogOut size={15} /> */}
                Logout
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
