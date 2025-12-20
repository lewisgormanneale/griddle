"use client";

import { useCurrentUserImage } from "@/hooks/use-current-user-image";
import { Avatar } from "@mantine/core";

export const CurrentUserAvatar = () => {
  const profileImage = useCurrentUserImage();

  return <Avatar src={profileImage} alt="profile picture" />;
};
