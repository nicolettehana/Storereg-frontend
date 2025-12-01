import React from "react";
import {
  Center,
  HStack,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";

const QuarterStats = ({ data, isPending }) => {
  return (
    <Stack>
      <HStack overflowX="auto">
        {data?.slice(0, -1)?.map((row) => {
          return (
            <Stat
              key={row?.quarterTypeCode}
              border="1px"
              borderColor="border"
              rounded="md"
              p={4}
              shadow="sm"
              maxW={52}
            >
              <Stack>
                <StatLabel>Type: {row?.quarterTypeCode}</StatLabel>
                <VStack>
                  <Tooltip
                    label={
                      <Stack spacing={0}>
                        <Text>Total Quarters: {row?.total}</Text>
                        <Text>Reserved: {row?.reserved}</Text>
                        <Text>Unusable: {row?.unusable}</Text>
                        <Text>Major Repair: {row?.majorRepair}</Text>
                      </Stack>
                    }
                  >
                    <Center
                      color="brand.200"
                      bg="brand.600"
                      rounded="full"
                      w={12}
                      h={12}
                    >
                      <StatNumber fontSize="xl">
                        <Skeleton isLoaded={!isPending} fadeDuration={2}>
                          {row?.total}
                        </Skeleton>
                      </StatNumber>
                    </Center>
                  </Tooltip>

                  <Tooltip label="Occupied">
                    <Center
                      color="red.200"
                      bg="red.600"
                      rounded="full"
                      w={12}
                      h={12}
                    >
                      <StatNumber fontSize="xl">
                        <Skeleton isLoaded={!isPending} fadeDuration={2}>
                          {row?.occupied}
                        </Skeleton>
                      </StatNumber>
                    </Center>
                  </Tooltip>

                  <Tooltip label="Vacant">
                    <Center
                      color="green.200"
                      bg="green.600"
                      rounded="full"
                      w={12}
                      h={12}
                    >
                      <StatNumber fontSize="xl">
                        <Skeleton isLoaded={!isPending} fadeDuration={2}>
                          {row?.vacant}
                        </Skeleton>
                      </StatNumber>
                    </Center>
                  </Tooltip>
                </VStack>
              </Stack>
            </Stat>
          );
        })}
      </HStack>

      <HStack
        border="1px"
        borderColor="border"
        p={4}
        rounded="md"
        wrap="wrap"
        justifyContent="space-between"
        gap={4}
      >
        <Text>Total: {data?.at(-1)?.total}</Text>
        <Text color="green.600">
          Paper & Stationery: {data?.at(-1)?.occupied}
        </Text>
        <Text color="red.600">Electricals: {data?.at(-1)?.vacant}</Text>
        <Text color="yellow.600">Missecllaneous: {data?.at(-1)?.reserved}</Text>
      </HStack>
    </Stack>
  );
};

export default QuarterStats;
