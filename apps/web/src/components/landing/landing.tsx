import { Link } from "react-router-dom";
import SectionCreateJoin from "./sec-create-join";
import SectionCreate from "./sec-create";
import SectionFind from "./sec-find";
import Header from "./header";

export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <SectionCreateJoin />
        <SectionCreate />
        <SectionFind />
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Watch Party. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
}
