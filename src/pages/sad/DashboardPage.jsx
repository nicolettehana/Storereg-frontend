import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import { AiFillWarning } from "react-icons/ai";
import { FaExclamationTriangle } from "react-icons/fa";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { MdWarningAmber } from "react-icons/md";

import {
  Box,
  Container,
  Grid,
  Heading,
  SimpleGrid,
  VStack,
  Flex,
  Icon,
} from "@chakra-ui/react";

import StatCard from "../../components/core/theme/StatCard";
import StockList from "../../components/core/theme/StockList";
import { useFetchYearRange } from "../../hooks/masterQueries";
import {
  useFetchCategoryStats,
  useFetchItemCategoryStats,
} from "../../hooks/masterQueries";
import StatSummaryCard from "../../components/core/theme/StatSummaryCard";
//import { MdWarningAmber } from "react-icons/md";

const YearRangePage = () => {
  // Queries
  const yearRangeQuery = useFetchYearRange();
  const itemsStatsQuery = useFetchItemCategoryStats();
  const firmsStatsQuery = useFetchCategoryStats();

  return (
    <Main>
      <Container maxW="7xl" py={2}>
        <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
          {/* LEFT SECTION */}
          <VStack align="stretch" spacing={6}>
            {/* TOP KPI CARDS */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <AiFillWarning size={28} color="orange" />
              <FaExclamationTriangle size={26} color="orange" />
              <HiOutlineExclamationTriangle size={28} color="orange" />
              <Icon as={MdWarningAmber} boxSize={5} color="yellow.500" />
              <StatSummaryCard
                title="In Stock"
                total={firmsStatsQuery?.data?.data.total}
                categories={firmsStatsQuery?.data?.data.byCategory}
              />
              <StatSummaryCard
                title="Firms"
                total={firmsStatsQuery?.data?.data.total}
                categories={firmsStatsQuery?.data?.data.byCategory}
              />
              <StatSummaryCard
                title="Items"
                total={itemsStatsQuery?.data?.data.total}
                categories={itemsStatsQuery?.data?.data.byCategory}
              />
            </SimpleGrid>

            {/* STOCK LIST SECTION */}
            <Box bg="gray.50" p={6} borderRadius="lg" boxShadow="md">
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Flex align="center" mb={2} gap={2}>
                  <AiFillWarning size={28} color="red" />
                  <Icon as={MdWarningAmber} boxSize={6} color="red.500" />
                  <MdWarningAmber size={22} color="red" />
                  <Heading size="md">Out of Stock</Heading>
                </Flex>
                <Flex align="center" mb={2} gap={2}>
                  <Icon as={MdWarningAmber} boxSize={6} color="yellow.500" />
                  <MdWarningAmber size={22} color="yellow" />
                  <Heading size="md">Low Stock</Heading>
                </Flex>

                <StockList
                  title="Out of Stock"
                  value="n"
                  items={[
                    {
                      name: "Parent Item 1",
                      children: ["Sub Item 1", "Sub Item 2"],
                    },
                    {
                      name: "Parent Item 2",
                      children: ["Sub Item A", "Sub Item B"],
                    },
                  ]}
                />

                <StockList
                  title="Low Stock (less than 10)"
                  value="5"
                  items={[
                    {
                      name: "Parent Item 1",
                      children: ["Sub Item 1", "Sub Item 2"],
                    },
                  ]}
                />

                <StockList
                  title="High Stock"
                  value="45"
                  items={[{ name: "Parent Item 1", children: ["Sub Item 1"] }]}
                />
              </SimpleGrid>
            </Box>
          </VStack>

          {/* RIGHT SIDEBAR */}
          <Box bg="gray.50" p={6} borderRadius="lg" boxShadow="md" h="100%">
            <Heading size="md" mb={4}>
              Sidebar
            </Heading>

            <SimpleGrid columns={1} spacing={4}>
              <StatCard title="Stock" value={110} />
              <StatCard title="Card 2" value="More text" />
              <StatCard title="Card 3" value="More content" />
            </SimpleGrid>
          </Box>
        </Grid>
      </Container>
    </Main>
  );
};

export default YearRangePage;
