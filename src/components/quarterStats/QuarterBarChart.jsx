import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { Box, Stack, Text } from "@chakra-ui/react";

const CustomToolTip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Stack bg="paper" border="1px" borderColor="border" p={4} rounded="md">
        <Text fontSize="small" fontWeight="semibold">
          Quarter Type: {label}
        </Text>
        <Stack spacing={0}>
          <Text fontSize="small">occupied: {payload[0].value}</Text>
          <Text fontSize="small">vacant: {payload[1].value}</Text>
        </Stack>
      </Stack>
    );
  }
};

const QuarterBarChart = ({ data }) => {
  return (
    <Box
      border="1px"
      borderColor="border"
      rounded="md"
      h={{ base: 250, md: "full" }}
      p={4}
      pl={1}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          // width={500}
          // height={300}
          data={data?.slice(0, -1)} // except the total part
          margin={{
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarterTypeCode" />
          <YAxis>
            <Label
              value="No. of quarters"
              angle={-90}
              position="left"
              dy="-10"
            />
          </YAxis>
          <Tooltip content={<CustomToolTip />} />
          <Legend />
          <Bar
            dataKey="occupied"
            fill="#ef4444"
            activeBar={<Rectangle fill="#fecaca" stroke="#ef4444" />}
          />
          <Bar
            dataKey="vacant"
            fill="#1983b0"
            activeBar={<Rectangle fill="#c2e6f5" stroke="#1983b0" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default QuarterBarChart;
