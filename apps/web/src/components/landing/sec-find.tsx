import { Button } from "@ui/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Input } from "@ui/components/ui/input";
import UsersIcon from "../icons/user-icon";

export default function SectionFind() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="join-party">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <img
            alt="Join Party"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            height="310"
            src="/placeholder.svg"
            width="550"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Join Party
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Find a Watch Party
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Search for and join active watch parties to enjoy videos with
                others. You can see the party details, the YouTube video being
                watched, and the number of participants.
              </p>
            </div>
            <div className="flex w-full max-w-lg items-center space-x-2">
              <Input
                className="flex-1"
                placeholder="Search for a party"
                type="text"
              />
              <Button type="submit">Search</Button>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Marvel Movie Marathon</CardTitle>
                  <CardDescription>
                    Watching the latest Marvel movie together.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Avengers: Endgame</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        YouTube
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium">
                        24 participants
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Join Party</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Game Night</CardTitle>
                  <CardDescription>
                    Playing some fun party games together.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Jackbox Party Pack 7
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        YouTube
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium">
                        12 participants
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Join Party</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
