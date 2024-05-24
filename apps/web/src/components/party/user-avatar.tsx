import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";

export default function UserAvatar({
  url,
  username,
}: {
  url: string;
  username: string;
}) {
  return (
    <Avatar>
      <AvatarImage
        alt="Host Avatar"
        src={`${url}?height=40&width=40`}
        referrerPolicy="no-referrer"
      />
      <AvatarFallback>
        {username
          .split(" ")
          .map((word) => word.charAt(0))
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
