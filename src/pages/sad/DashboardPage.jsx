import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import {
  Box,
  Container,
  Grid,
  Heading,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";

import StatCard from "../../components/core/theme/StatCard";
import StockList from "../../components/core/theme/StockList";
import { useFetchYearRange } from "../../hooks/masterQueries";

const YearRangePage = () => {
  // Queries
  const yearRangeQuery = useFetchYearRange();
  console.log(yearRangeQuery.data);

  return (
    <Main>
      <Container maxW="7xl" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
          {/* LEFT SECTION */}
          <VStack align="stretch" spacing={6}>
            {/* TOP KPI CARDS */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <StatCard title="Stock" value={110} bg="red.900" color="white" />
              <StatCard title="Items" value={50} />
              <StatCard title="Firms" value={25} />
            </SimpleGrid>

            {/* STOCK LIST SECTION */}
            <Box bg="gray.50" p={6} borderRadius="lg" boxShadow="md">
              <Heading size="md" mb={4}>
                Stock Breakdown
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
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
