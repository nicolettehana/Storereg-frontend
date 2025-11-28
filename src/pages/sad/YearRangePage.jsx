import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import {
  Avatar,
  AvatarBadge,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  SkeletonText,
} from "@chakra-ui/react";
import {
  elementCounter,
  Pagination,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../components/core/Table";
import { useFetchUsersProfile } from "../../hooks/userQueries";
import { useFetchYearRange } from "../../hooks/masterQueries";
import { encodeEmail } from "../../components/utils/emailFormatter";
import ChangeMobileForm from "../../forms/profile/ChangeMobileForm";
import { useState } from "react";
import VerifyChangeMobileOTPForm from "../../forms/profile/VerifyChangeMobileOTPForm";

const YearRangePage = () => {
  // Queries
  const profileQuery = useFetchUsersProfile();
  const yearRangeQuery = useFetchYearRange();
  console.log(yearRangeQuery.data);

  // States
  const [otpToken, setOtpToken] = useState("");
  const [mobileno, setMobileno] = useState("");

  // Disclosures
  const mobileDisclosure = useDisclosure();
  const verifyOtpDisclosure = useDisclosure();

  return (
    <Main>
      {/* Modals */}
      <ChangeMobileForm
        isOpen={mobileDisclosure.isOpen}
        onClose={mobileDisclosure.onClose}
        verifyOtpOnOpen={verifyOtpDisclosure.onOpen}
        setOtpToken={setOtpToken}
        setMobileno={setMobileno}
      />

      <VerifyChangeMobileOTPForm
        isOpen={verifyOtpDisclosure.isOpen}
        onClose={verifyOtpDisclosure.onClose}
        otpToken={otpToken}
        mobileno={mobileno}
      />

      <Section>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {/* User Info */}
            <Stack
              spacing={8}
              border="1px"
              borderColor="border"
              rounded="md"
              p={6}
            >
              <VStack spacing={4}>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Sl. No.</Th>
                        <Th>Start Year</Th>
                        <Th>End Year</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {(yearRangeQuery.isPending
                        ? new Array(10).fill(null)
                        : yearRangeQuery?.data?.data
                      )?.map((row, index) => {
                        return (
                          <Tr key={index}>
                            <Td>
                              <SkeletonText
                                w="8"
                                noOfLines={1}
                                isLoaded={!yearRangeQuery.isPending}
                                fadeDuration={index}
                              >
                                {elementCounter(index)}
                              </SkeletonText>
                            </Td>
                            <Td>
                              <SkeletonText
                                noOfLines={1}
                                isLoaded={!yearRangeQuery.isPending}
                                fadeDuration={index}
                              >
                                {row?.startYear}
                              </SkeletonText>
                            </Td>
                            <Td>
                              <SkeletonText
                                noOfLines={1}
                                isLoaded={!yearRangeQuery.isPending}
                                fadeDuration={index}
                              >
                                {row?.endYear}
                              </SkeletonText>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>

                <Button variant="brand">Add New Year Range</Button>
              </VStack>
            </Stack>
          </SimpleGrid>
        </Container>
      </Section>
    </Main>
  );
};

export default YearRangePage;
