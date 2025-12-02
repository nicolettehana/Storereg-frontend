import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import CreatePurchaseForm from "../../../forms/purchase/CreatePurchaseForm";

const CreatePurchasePage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">Add Rate</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <CreatePurchaseForm />
        </Container>
      </Section>
    </Main>
  );
};

export default CreatePurchasePage;
