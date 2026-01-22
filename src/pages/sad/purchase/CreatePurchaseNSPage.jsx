import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import CreatePurchaseOrderNSForm from "../../../forms/purchase/CreatePurchaseOrderNSForm ";

const CreatePurchaseNSPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">Add new purchase order (Non-Stock)</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <CreatePurchaseOrderNSForm />
        </Container>
      </Section>
    </Main>
  );
};

export default CreatePurchaseNSPage;
