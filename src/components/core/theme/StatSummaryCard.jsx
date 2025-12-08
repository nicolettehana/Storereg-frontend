import { Card, CardBody, Heading, Text, Stack, Flex } from "@chakra-ui/react";
import { getCategoryColorScheme } from "../CategoryColors";

const StatSummaryCard = ({ title, total, categories }) => {
  const bg = "#f9fafeff";

  return (
    <Card bg={bg}>
      <CardBody>
        {/* Title + Total */}
        <Heading size="md" mb={2}>
          {title}
        </Heading>

        <Text fontSize="2xl" fontWeight="bold" mb={3}>
          {total}
        </Text>

        {/* Category list */}
        <Stack spacing={1}>
          {categories?.map((cat) => {
            const color = getCategoryColorScheme(cat?.categoryCode) + ".700";

            return (
              <Flex key={cat?.categoryCode} justify="space-between">
                <Text fontWeight="medium" color={color}>
                  {cat?.category}
                </Text>
                <Text fontWeight="bold" color={color}>
                  {cat?.totalFirms}
                </Text>
              </Flex>
            );
          })}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default StatSummaryCard;
