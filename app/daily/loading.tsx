import { Center, Loader } from '@mantine/core';

export default function Loading() {
  return (
    <Center mt={80} data-testid="daily-loading">
      <Loader />
    </Center>
  );
}
