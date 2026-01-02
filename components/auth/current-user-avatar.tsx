'use client';

import { Avatar } from '@mantine/core';
import { useAuthUser } from '@/hooks/use-auth-user';
import { useCurrentUserImage } from '@/hooks/use-current-user-image';

export const CurrentUserAvatar = () => {
  const { user } = useAuthUser();
  const profileImage = useCurrentUserImage(user?.id);

  return <Avatar src={profileImage} alt="profile picture" />;
};
