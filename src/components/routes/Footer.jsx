import React from "react";
import { Box, Container, Link, Show, Text, VStack } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Container as="footer" maxW="container.xl">
      <Box
        py={4}
        bg="paper"
        roundedTop="2xl"
        border="1px"
        borderBottom="0px"
        borderColor="border"
      >
        <VStack>
          <Show below="lg">
            <Link
              href="https://gad.meghalaya.gov.in/assets/docs/Allotment_of_Government_Residences_General_Pool_Rules_1990.pdf"
              target="_blank"
              fontSize="xs"
              textAlign="center"
            >
              The allotment of government residences (General Pool) rules,
              (Meghalaya)
            </Link>
          </Show>

          <VStack spacing={0}>
            <Text fontSize="xs" textAlign="center" color="heading">
              Content owned by General Administration Department, Government of
              Meghalaya
            </Text>

            <Text fontSize="xs" textAlign="center" color="heading">
              Developed and hosted by National Informatics Center, Meghalaya
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default Footer;
