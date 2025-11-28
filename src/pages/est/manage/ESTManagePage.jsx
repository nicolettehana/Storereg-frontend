import React from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Container, Stack } from "@chakra-ui/react";
import { useFetchVacantAndReservedQuarters } from "../../../hooks/quartersQueries";
import ESTManageTableWrapper from "./ESTManageTableWrapper";

const ESTManagePage = () => {
  // Queries
  const quarterQuery = useFetchVacantAndReservedQuarters();

  return (
    <Main>
      <Section>
        <Container minW="full">
          <Stack spacing={4}>
            {/* <ESTManageTableWrapper query={quarterQuery} /> */}
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default ESTManagePage;
