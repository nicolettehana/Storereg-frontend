import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import { AiFillWarning } from "react-icons/ai";
import { FaExclamationTriangle } from "react-icons/fa";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { MdWarningAmber } from "react-icons/md";
import InventoryCard from "../../components/stats/InventoryCard";
import ExpensePieChart from "../../components/charts/ExpensePieChart";

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
import { useFetchItemsLevelList } from "../../hooks/balanceQueries";
import { useFetchAmount } from "../../hooks/purchaseQueries";
import StatSummaryCard from "../../components/core/theme/StatSummaryCard";
import { useState } from "react";
//import { MdWarningAmber } from "react-icons/md";

const YearRangePage = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  // Queries
  const yearRangeQuery = useFetchYearRange();
  const itemsStatsQuery = useFetchItemCategoryStats();
  const firmsStatsQuery = useFetchCategoryStats();
  const outOfStockQuery = useFetchItemsLevelList(0);
  const lowStockQuery = useFetchItemsLevelList(10);
  const amountQuery = useFetchAmount(year);

  return (
    <Main>
      <Container maxW="8xl" py={2}>
        <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
          {/* LEFT SECTION */}
          <VStack align="stretch" spacing={6}>
            {/* TOP KPI CARDS */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
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
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {/* <Flex align="center" mb={2} gap={2}>
                  <AiFillWarning size={28} color="red" />
                  <Icon as={MdWarningAmber} boxSize={6} color="red.500" />
                  <MdWarningAmber size={22} color="red" />
                  <FaExclamationTriangle size={26} color="orange" />
                  <HiOutlineExclamationTriangle size={28} color="orange" />
                  <Icon as={MdWarningAmber} boxSize={5} color="yellow.500" />
                  <Heading size="md">Out of Stock</Heading>
                </Flex> */}
                {/* <Flex align="center" mb={2} gap={2}>
                  <Icon as={MdWarningAmber} boxSize={6} color="yellow.500" />
                  <MdWarningAmber size={22} color="yellow" />
                  <Heading size="md">Low Stock</Heading>
                </Flex> */}

                <div style={{ padding: "20px" }}>
                  <InventoryCard
                    title="Out of Stock"
                    data={outOfStockQuery?.data?.data}
                    iconColor="red"
                  />
                </div>

                <div style={{ padding: "20px" }}>
                  <InventoryCard
                    title="Low Stock"
                    data={lowStockQuery?.data?.data}
                    iconColor="orange"
                  />
                </div>
              </SimpleGrid>
            </Box>
          </VStack>

          {/* RIGHT SIDEBAR */}
          <Box bg="gray.50" p={6} borderRadius="lg" boxShadow="md" h="100%">
            <Heading size="md" mb={4}>
              Sidebar
            </Heading>

            <ExpensePieChart data={amountQuery?.data?.data} />
          </Box>
        </Grid>
      </Container>
    </Main>
  );
};

export default YearRangePage;
