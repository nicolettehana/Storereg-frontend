import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Heading,
  Stack,
} from "@chakra-ui/react";
import registrationVid from "../../assets/manual/user_registration_sign_in.mp4";
import applicationVid from "../../assets/manual/applying_for_quarters.mp4";

const ManualPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Stack spacing={8}>
            <Heading size="lg">Manual</Heading>

            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Heading size="md" flex="1" textAlign="left">
                      User Registration & Sign In
                    </Heading>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box as="video" w="full" controls>
                    <source src={registrationVid} type="video/mp4" />
                    Your browser does not support the video tag.
                  </Box>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Heading size="md" flex="1" textAlign="left">
                      Applying for Quarters
                    </Heading>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box as="video" w="full" controls>
                    <source src={applicationVid} type="video/mp4" />
                    Your browser does not support the video tag.
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default ManualPage;
