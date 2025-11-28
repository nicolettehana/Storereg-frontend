import React from "react";
import {
  Box,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { MdOutlinePendingActions, MdOutlineTaskAlt } from "react-icons/md";

const DashboardStatsWrapper = ({ query }) => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
      <HStack border="1px" borderColor="border" rounded="md" p={4} shadow="sm">
        <Stat>
          <StatNumber color="brand.600" fontSize="4xl">
            <Skeleton isLoaded={!query.isPending} fadeDuration={1} w={24}>
              {query?.data?.data?.pendingForAction}
            </Skeleton>
          </StatNumber>
          <StatLabel>Pending for Action by User</StatLabel>
        </Stat>
        <Icon as={MdOutlinePendingActions} boxSize={10} color="brand.600" />
      </HStack>

      <HStack border="1px" borderColor="border" rounded="md" p={4} shadow="sm">
        <Stat>
          <StatNumber color="green.600" fontSize="4xl">
            <Skeleton isLoaded={!query.isPending} fadeDuration={2} w={24}>
              {query?.data?.data?.completed}
            </Skeleton>
          </StatNumber>
          <StatLabel>Completed</StatLabel>
        </Stat>
        <Icon as={MdOutlineTaskAlt} boxSize={10} color="green.600" />
      </HStack>
    </SimpleGrid>
  );
};

export default DashboardStatsWrapper;
