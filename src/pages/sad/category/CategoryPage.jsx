import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Avatar,
  AvatarBadge,
  Button,
  Container,
  HStack,
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
} from "../../../components/core/Table";
import { useFetchUsersProfile } from "../../../hooks/userQueries";
import {
  useFetchYearRange,
  useFetchCategories,
} from "../../../hooks/masterQueries";
import ChangeMobileForm from "../../../forms/profile/ChangeMobileForm";
import { useState } from "react";
import VerifyChangeMobileOTPForm from "../../../forms/profile/VerifyChangeMobileOTPForm";

const CategoryPage = () => {
  // Queries
  const profileQuery = useFetchUsersProfile();
  const yearRangeQuery = useFetchYearRange();
  const categoryQuery = useFetchCategories();

  // States
  const [otpToken, setOtpToken] = useState("");
  const [mobileno, setMobileno] = useState("");

  // Disclosures
  const mobileDisclosure = useDisclosure();
  const verifyOtpDisclosure = useDisclosure();

  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          {/* User Info */}
          <Stack spacing={8} p={6}>
            <VStack spacing={4}>
              <HStack w="100%" justify="flex-end">
                <Button variant="brand">Add New Category</Button>
              </HStack>

              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Sl. No.</Th>
                      <Th>Category Code</Th>
                      <Th>Category</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {(categoryQuery.isPending
                      ? new Array(10).fill(null)
                      : categoryQuery?.data?.data
                    )?.map((row, index) => {
                      return (
                        <Tr key={index}>
                          <Td>
                            <SkeletonText
                              w="8"
                              noOfLines={1}
                              isLoaded={!categoryQuery.isPending}
                              fadeDuration={index}
                            >
                              {elementCounter(index)}
                            </SkeletonText>
                          </Td>
                          <Td>
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!categoryQuery.isPending}
                              fadeDuration={index}
                            >
                              {row?.code}
                            </SkeletonText>
                          </Td>
                          <Td>
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!categoryQuery.isPending}
                              fadeDuration={index}
                            >
                              {row?.name}
                            </SkeletonText>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default CategoryPage;
