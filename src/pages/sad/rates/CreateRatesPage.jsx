import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import CreateItemForm from "../../../forms/items/CreateItemForm";

const CreateRatesPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">Add Rate</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <CreateItemForm />
        </Container>
      </Section>
    </Main>
  );
};

export default CreateRatesPage;
