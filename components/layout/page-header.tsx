import { Text, Title } from '@mantine/core';

type PageHeaderProps = {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
};

export function PageHeader({ title, description, align = 'left' }: PageHeaderProps) {
  return (
    <div>
      <Title order={1} ta={align}>
        {title}
      </Title>
      {description ? (
        <Text c="dimmed" ta={align}>
          {description}
        </Text>
      ) : null}
    </div>
  );
}
