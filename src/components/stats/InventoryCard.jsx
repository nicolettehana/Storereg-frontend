import {
  Card,
  CardBody,
  Heading,
  Text,
  Box,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { getCategoryColorScheme } from "../core/CategoryColors";
import { FaExclamationTriangle } from "react-icons/fa";

const InventoryCard = ({ title, Icon, data, iconColor = "orange" }) => {
  return (
    <Card color="black" shadow="md">
      <CardBody>
        {/* Card title with icon */}
        <HStack mb={4}>
          <FaExclamationTriangle size={26} color={iconColor} />
          <Heading size="lg">{title}</Heading>
        </HStack>

        {/* Categories */}
        <VStack align="start" spacing={4}>
          {data?.map((category, catIdx) => {
            const textColor =
              getCategoryColorScheme(category.categoryCode) + ".700";
            const color = getCategoryColorScheme(category.categoryCode);

            return (
              <Box key={catIdx} w="100%">
                {/* Category name */}
                {/* <Text fontWeight="bold" mb={2} color={textColor}>
                  {category.category}
                </Text> */}
                {category.items && category.items.length > 0 ? (
                  <Badge colorScheme={color} fontSize="sm">
                    {category.category}
                  </Badge>
                ) : (
                  <></>
                )}

                {/* Items */}
                <VStack align="start" spacing={1} pl={4}>
                  {category.items && category.items.length > 0 ? (
                    category.items.map((item, idx) => (
                      <Box key={idx} w="100%" pt={3}>
                        {/* Item with numbering */}
                        <Text fontWeight="semibold" fontSize="sm">
                          {idx + 1}. {item.itemName}
                          {/* If no sub-items, show stock */}
                          {(!item.subItems || item.subItems.length === 0) &&
                            item.stock !== null &&
                            `: ${item.stock}`}
                        </Text>

                        {/* Sub-items, if present */}
                        {item.subItems && item.subItems.length > 0 && (
                          <VStack align="start" pl={5} mt={1} spacing={1}>
                            {item.subItems.map((sub, subIdx) => (
                              <Text key={subIdx} fontSize="sm">
                                <b>{String.fromCharCode(97 + subIdx)}) </b>
                                <Badge textTransform="none">
                                  {sub.subItem}:{" "}
                                  <b>
                                    {sub.stock !== null ? sub.stock : "N/A"}
                                  </b>
                                </Badge>
                              </Text>
                            ))}
                          </VStack>
                        )}
                      </Box>
                    ))
                  ) : (
                    <></>
                  )}
                </VStack>
              </Box>
            );
          })}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default InventoryCard;
