import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Hide,
  HStack,
  UnorderedList,
  SimpleGrid,
  Stack,
  Text,
  ListItem,
  Link as CLink,
  Show,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SignInForm from "../../forms/auth/SignInForm";
import quartersImg from "../../assets/quarters6.png";
import MdIcon from "../../components/core/MdIcon";
import { useGetXsrfToken } from "../../hooks/authQueries";

const HomePage = () => {
  // Queries
  // const xsrfQuery = useGetXsrfToken();

  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }}>
            {/* LHS */}
            <Hide below="lg">
              <Stack spacing={8} mt={16}>
                <Stack spacing={16}>
                  <Stack
                    spacing={20}
                    backgroundImage={quartersImg}
                    backgroundSize="cover"
                    backgroundPosition="center"
                  >
                    <Stack spacing={4} color="brand.600">
                      <Heading size="xl">Store Register</Heading>
                      <Text fontSize="2xl">
                        <strong>Secretariat Administration Department</strong>{" "}
                        <br />
                        Government Of Meghalaya
                      </Text>
                    </Stack>

                    <Button
                      as={Link}
                      to="/auth/register"
                      size="lg"
                      variant="brand"
                      w="fit-content"
                      mt={8}
                      mb={4}
                      ml={4}
                    >
                      Register Now
                    </Button>
                  </Stack>

                  <HStack
                    spacing={4}
                    bg="brand.100"
                    py={8}
                    px={4}
                    rounded="xl"
                    border="1px"
                    borderColor="brand.300"
                  >
                    <MdIcon
                      iconName="home"
                      size={32}
                      color="brand.200"
                      bg="brand.600"
                      p={4}
                      rounded="full"
                    />
                    <Stack>
                      <Heading fontWeight="bold" size="md" color="brand.950">
                        How it works?
                      </Heading>
                      <UnorderedList color="brand.600">
                        <ListItem>Login</ListItem>
                        <ListItem>Fill & generate form online</ListItem>

                        <ListItem>
                          Upload form (Signed & Sealed by forwarding officer) &
                          submit your application online
                        </ListItem>
                        <ListItem>
                          Track application's status, as it progresses
                        </ListItem>
                      </UnorderedList>
                      <Text>
                        Allotment Rules -{" "}
                        <CLink
                          href="https://gad.meghalaya.gov.in/assets/docs/Allotment_of_Government_Residences_General_Pool_Rules_1990.pdf"
                          target="_blank"
                        >
                          The allotment of government residences (General Pool)
                          rules, (Meghalaya)
                        </CLink>
                      </Text>
                    </Stack>
                  </HStack>
                </Stack>
              </Stack>
            </Hide>

            {/* RHS */}
            <Center>
              <VStack spacing={8}>
                <Show below="lg">
                  <Heading size="lg" color="brand.600" textAlign="center">
                    Quarters Allotment Management System
                  </Heading>
                </Show>

                <Box
                  bg="paper"
                  // bg="white"
                  border="1px"
                  borderColor="border"
                  rounded="2xl"
                  p={8}
                  w="sm"
                  maxW="sm"
                >
                  <SignInForm />
                </Box>
              </VStack>
            </Center>
          </SimpleGrid>
        </Container>
      </Section>
    </Main>
  );
};

export default HomePage;
