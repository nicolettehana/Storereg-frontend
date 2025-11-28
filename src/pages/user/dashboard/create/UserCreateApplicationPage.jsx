import React from "react";
import Main from "../../../../components/core/semantics/Main";
import Section from "../../../../components/core/semantics/Section";
import { Container, Heading, Link, Stack } from "@chakra-ui/react";
import CreateApplicationForm from "../../../../forms/applications/CreateApplicationForm";

const UserCreateApplicationPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Stack spacing={4}>
            <Stack>
              <Heading size="md">Apply For Quarter</Heading>
              <Link
                href="https://gad.meghalaya.gov.in/assets/docs/Allotment_of_Government_Residences_General_Pool_Rules_1990.pdf"
                target="_blank"
                fontSize="small"
              >
                The allotment of government residences (General Pool) rules,
                (Meghalaya)
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <CreateApplicationForm />
        </Container>
      </Section>
    </Main>
  );
};

export default UserCreateApplicationPage;
