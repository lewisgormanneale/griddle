"use client";

import { useCurrentUserImage } from "@/hooks/use-current-user-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CurrentUserAvatar = () => {
  const profileImage = useCurrentUserImage();

  return (
    <Avatar>
      {profileImage && (
        <AvatarImage src={profileImage.avatarUrl} alt={profileImage.initials} />
      )}
      <AvatarFallback>{profileImage.initials}</AvatarFallback>
    </Avatar>
  );
};
