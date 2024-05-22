import { Link } from "react-router-dom";
import WatchIcon from "../icons/watch-icon";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
      <Link className="flex items-center" to="#">
        <WatchIcon className="h-6 w-6" />
        <span className="ml-2 text-lg font-semibold">Watch Party</span>
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="#"
        >
          Login
        </Link>
        <Link
          className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          to="#"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
