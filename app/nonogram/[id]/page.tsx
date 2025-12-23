"use client";

import {
  getNonogram,
  getNonogramHints,
  getUserCompletionOfNonogram,
  saveNonogramCompletion,
} from "@/utils/supabase/queries";
import { Tables } from "@/types/database.types";
import { useEffect, useState, use } from "react";
import { ControlPanel } from "@/components/nonogram/control-panel/control-panel"; //
import { Grid } from "@/components/nonogram/grid/grid";
import { Leaderboard } from "@/components/nonogram/leaderboard/leaderboard";
import { createClient } from "@/utils/supabase/client";
import { Box, Card, Divider, Flex, Group, LoadingOverlay, Text, Title } from "@mantine/core";

export default function NonogramPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const { id } = params;
  const [nonogram, setNonogram] = useState<Tables<"nonograms">>();
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [columnHints, setColumnHints] = useState<number[][]>([]);
  const [winConditionMet, setWinConditionMet] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completion, setCompletion] =
    useState<Tables<"completed_nonograms"> | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return;

      const completed = await getUserCompletionOfNonogram(user.id, Number(id));
      if (completed) {
        setCompletion(completed);
        setWinConditionMet(true); // disable further editing if already completed
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!completion) {
      setStartTime(Date.now());
    }
  }, [completion]);

  const onWinConditionMet = async () => {
    setWinConditionMet(true);
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user || startTime === null) return;

    const endTime = Date.now();
    const durationInSeconds = Math.floor((endTime - startTime) / 1000);

    await saveNonogramCompletion({
      user_id: user.id,
      nonogram_id: Number(id),
      completion_time: durationInSeconds,
    });
  };

  useEffect(() => {
    getNonogram(Number(id)).then((data) => setNonogram(data));
    getNonogramHints(Number(id)).then(
      (data) => {
        setRowHints(data.rows);
        setColumnHints(data.columns);
      },
      (error) => console.error(error)
    );
  }, [id]);

  if (!nonogram) {
    return (
      <Box pos="relative" w="100%" h="calc(100vh - 60px)">
        <LoadingOverlay visible={true}></LoadingOverlay>;
      </Box>
    );
  }

  return (
      <Flex direction="column" align="center" p="md"> 
        <Title mb="md" order={1} ta="center">
          #{id} <span>&quot;{nonogram.title}&quot;</span>
        </Title>
        <Card w="100%">
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text c="dimmed" size="sm">
                <span>
                  {nonogram.height} x {nonogram.width} | {nonogram.author} |{" "}
                  {nonogram.license} | {nonogram.copyright}
                </span>
              </Text>
            </Group>
          </Card.Section>
          <Card.Section p="md">
            <Card withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <ControlPanel winConditionMet={winConditionMet} />
              </Card.Section>
              <Card.Section>
                <Flex justify="center" p="md">
                  <Grid
                    nonogram={nonogram}
                    rowHints={rowHints}
                    columnHints={columnHints}
                    winConditionMet={winConditionMet}
                    onWinConditionMet={onWinConditionMet}
                  />
                </Flex>
              </Card.Section>
            </Card>
          </Card.Section>
          <Card.Section>
            <Divider className="my-4" />
            <Leaderboard nonogram_id={nonogram.id} />
          </Card.Section>
        </Card>  
    </Flex>
  );
}
