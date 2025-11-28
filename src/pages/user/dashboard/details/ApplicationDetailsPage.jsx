import { useEffect, useState } from "react";
import Main from "../../../../components/core/semantics/Main";
import Section from "../../../../components/core/semantics/Section";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Container,
  Heading,
  Hide,
  HStack,
  Show,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ApplicationDetails from "./ApplicationDetails";
import DownloadApplicationForm from "../../../../forms/applications/DownloadApplicationForm";
import ForwardApplicationForm from "../../../../forms/applications/ForwardApplicationForm";
import RejectApplicationForm from "../../../../forms/applications/RejectApplicationForm";
import ReUploadApplicationForm from "../../../../forms/applications/ReUploadApplicationForm";
import MoveApplicationToWaitingListForm from "../../../../forms/applications/MoveApplicationToWaitingListForm";
import MoveApplicationToDifferentWaitingListForm from "../../../../forms/applications/MoveApplicationToDifferentWaitingListForm";
import AllotApplicationForm from "../../../../forms/applications/AllotApplicationForm";
import SendToChairmanForm from "../../../../forms/applications/SendToChairmanForm";
import ForwardWaitingListApplicationForm from "../../../../forms/waitingList/ForwardWaitingListApplicationForm";
import {
  useDownloadBookingForm,
  useFetchAllotmentDetails,
  useFetchApplicationRemarks,
} from "../../../../hooks/bookingQueries";
import PDFApplication from "./PDFApplication";
import AllotDifferentQuarterForm from "../../../../forms/applications/AllotDifferentQuarterForm";
import ApplicationFinalApprovalForm from "../../../../forms/applications/ApplicationFinalApprovalForm";
import { MdOutlineArrowBack, MdOutlineDownload } from "react-icons/md";
import ForwardWaitingListApplicationPDFForm from "../../../../forms/waitingList/ForwardWaitingListApplicationPDFForm";

const ApplicationDetailsPage = ({ role, withAllotmentDetails = true }) => {
  // States
  const [actionCode, setActionCode] = useState(-1);
  const [pdfFile, setPdfFile] = useState(null);

  // Hooks
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) return <Navigate to="/user/bookings" />;
  const rowState = location.state.rowState;
  const tab = location.state.tab;

  // Disclosures
  const downloadDisclosure = useDisclosure();
  const pdfPreviewDisclosure = useDisclosure();
  // DA
  const forwardDisclosure = useDisclosure();
  const rejectDisclosure = useDisclosure();
  const uploadDisclosure = useDisclosure();
  // CH
  const forwardToCSDisclosure = useDisclosure();
  const forwardPdfDisclosure = useDisclosure();
  const waitingListDisclosure = useDisclosure();
  const differentWaitingListDisclosure = useDisclosure();
  const allotDifferentDisclosure = useDisclosure();
  // CS
  const allotDisclosure = useDisclosure();
  const sendDisclosure = useDisclosure();
  const finalDisclosure = useDisclosure();

  // Handlers
  const handleActions = (action) => {
    setActionCode(action.actionCode);

    switch (action.actionCode) {
      case 2:
      case 3:
        // forwardDisclosure.onOpen();
        waitingListDisclosure.onOpen();
        break;
      case 4:
        forwardToCSDisclosure.onOpen();
        break;
      case 5:
        allotDisclosure.onOpen();
        break;
      case 6:
        rejectDisclosure.onOpen();
        break;
      case 9:
        uploadDisclosure.onOpen();
        break;
      case 11:
        sendDisclosure.onOpen();
        break;
      case 12:
        differentWaitingListDisclosure.onOpen();
        break;
      case 13:
        allotDifferentDisclosure.onOpen();
        break;
      case 14:
        finalDisclosure.onOpen();
        break;
      default:
        break;
    }
  };

  // Queries
  const remarksQuery = useFetchApplicationRemarks(rowState?.appNo);
  const allotmentDetailsQuery = useFetchAllotmentDetails(rowState?.appNo);
  const downloadFormQuery = useDownloadBookingForm(
    (response) => {
      if (response.data instanceof Blob && response.data.size > 0) {
        const url = window.URL.createObjectURL(response.data);
        setPdfFile(url);
        pdfPreviewDisclosure.onOpen();
      } else {
        toast({
          isClosable: true,
          duration: 3000,
          position: "top-right",
          status: "error",
          title: "Error",
          description:
            "Oops! something went wrong. Couldn't download application form.",
        });
      }

      return response;
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail ||
          "Oops! something went wrong. Couldn't download application form.",
      });
      return error;
    }
  );

  // Side-Effects
  useEffect(() => {
    // Query Allotment Details only if it is CH/CS Role
    if (
      (role === "CH" || role === "CS") &&
      tab !== "pending" &&
      withAllotmentDetails
    ) {
      allotmentDetailsQuery.refetch();
    }
  }, []);

  return (
    <>
      {/* Modals */}
      <DownloadApplicationForm
        rowState={rowState}
        isOpen={downloadDisclosure.isOpen}
        onClose={downloadDisclosure.onClose}
      />

      <PDFApplication
        rowState={rowState}
        pdfFile={pdfFile}
        isOpen={pdfPreviewDisclosure.isOpen}
        onClose={pdfPreviewDisclosure.onClose}
      />

      {role !== "USER" && (
        <RejectApplicationForm
          actionCode={actionCode}
          rowState={rowState}
          isOpen={rejectDisclosure.isOpen}
          onClose={rejectDisclosure.onClose}
          role={role}
        />
      )}

      {/* DA */}
      {role === "DA" && (
        <>
          <ForwardApplicationForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={forwardDisclosure.isOpen}
            onClose={forwardDisclosure.onClose}
          />

          <ReUploadApplicationForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={uploadDisclosure.isOpen}
            onClose={uploadDisclosure.onClose}
          />
        </>
      )}

      {/* CH */}
      {role === "CH" && (
        <>
          <ForwardWaitingListApplicationForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={forwardToCSDisclosure.isOpen}
            onClose={forwardToCSDisclosure.onClose}
            setPdfURL={setPdfFile}
            forwardPdfDisclosure={forwardPdfDisclosure}
          />

          <ForwardWaitingListApplicationPDFForm
            pdfURL={pdfFile}
            actionCode={actionCode}
            rowState={rowState}
            isOpen={forwardPdfDisclosure.isOpen}
            onClose={forwardPdfDisclosure.onClose}
          />

          <MoveApplicationToWaitingListForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={waitingListDisclosure.isOpen}
            onClose={waitingListDisclosure.onClose}
          />

          <MoveApplicationToDifferentWaitingListForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={differentWaitingListDisclosure.isOpen}
            onClose={differentWaitingListDisclosure.onClose}
          />

          <AllotDifferentQuarterForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={allotDifferentDisclosure.isOpen}
            onClose={allotDifferentDisclosure.onClose}
          />

          <ApplicationFinalApprovalForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={finalDisclosure.isOpen}
            onClose={finalDisclosure.onClose}
          />

          <ReUploadApplicationForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={uploadDisclosure.isOpen}
            onClose={uploadDisclosure.onClose}
          />
        </>
      )}

      {/* CS */}
      {role === "CS" && (
        <>
          <AllotApplicationForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={allotDisclosure.isOpen}
            onClose={allotDisclosure.onClose}
          />

          <SendToChairmanForm
            actionCode={actionCode}
            rowState={rowState}
            isOpen={sendDisclosure.isOpen}
            onClose={sendDisclosure.onClose}
          />
        </>
      )}

      {/* Main */}
      <Main>
        <Section>
          <Container maxW="container.xl">
            <Stack spacing={8}>
              <Stack spacing={4}>
                <Button
                  variant="outline"
                  leftIcon={<MdOutlineArrowBack />}
                  w="fit-content"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <HStack justifyContent="space-between">
                  <Heading size="md">Details</Heading>
                  {role !== "CS" && (
                    <HStack>
                      <Button
                        variant="outline"
                        onClick={() =>
                          downloadFormQuery.mutate({ appNo: rowState?.appNo })
                        }
                        isLoading={downloadFormQuery.isPending}
                        loadingText="Downloading"
                        leftIcon={<MdOutlineDownload />}
                      >
                        Download
                      </Button>
                    </HStack>
                  )}
                </HStack>

                {/* Details */}
                <ApplicationDetails row={rowState} />

                {/* Allotment Details */}
                {role === "CH" && tab !== "pending" && withAllotmentDetails ? (
                  <Stack
                    border="1px"
                    borderColor="border"
                    rounded="lg"
                    p={{ base: 4, md: 8 }}
                  >
                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      gap={{ base: 2, md: 4 }}
                    >
                      <Text color="body">Quarter Type</Text>
                      <Text fontWeight="bold">
                        {allotmentDetailsQuery?.data?.data?.quarterType || "-"}
                      </Text>
                    </SimpleGrid>

                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      gap={{ base: 2, md: 4 }}
                    >
                      <Text color="body">Quarter Number</Text>
                      <Text fontWeight="bold">
                        {allotmentDetailsQuery?.data?.data?.quarterNo || "-"}
                      </Text>
                    </SimpleGrid>

                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      gap={{ base: 2, md: 4 }}
                    >
                      <Text color="body">Remarks</Text>
                      <Text fontWeight="bold">
                        {allotmentDetailsQuery?.data?.data?.remarks || "-"}
                      </Text>
                    </SimpleGrid>
                  </Stack>
                ) : null}

                {remarksQuery?.data?.data?.remark && (
                  <Alert status="info" rounded="md">
                    <AlertIcon />
                    <AlertTitle>Remarks</AlertTitle>
                    <AlertDescription>
                      {remarksQuery?.data?.data?.remark}
                    </AlertDescription>
                  </Alert>
                )}

                {role !== "USER" && (
                  <>
                    <Show below="md">
                      <Stack>
                        {rowState?.actions?.map((action) => (
                          <Button
                            key={action?.actionCode}
                            variant="outline"
                            onClick={() => handleActions(action)}
                          >
                            {action?.action}
                          </Button>
                        ))}
                      </Stack>
                    </Show>

                    <Hide below="md">
                      {role !== "CS" && (
                        <HStack justifyContent="end">
                          {rowState?.actions?.map((action) => {
                            let colorScheme = "white";

                            switch (action.actionCode) {
                              case 2:
                              case 4:
                              case 5:
                              case 11:
                              case 14:
                                colorScheme = "brand";
                                break;
                              case 6:
                                colorScheme = "red";
                                break;
                              case 3:
                              case 9:
                              case 12:
                              case 13:
                                colorScheme = "orange";
                                break;
                              default:
                                colorScheme = null;
                                break;
                            }

                            if (colorScheme) {
                              return (
                                <Button
                                  key={action?.actionCode}
                                  onClick={() => handleActions(action)}
                                  w="fit-content"
                                  colorScheme={colorScheme}
                                >
                                  {action?.action}
                                </Button>
                              );
                            } else {
                              return (
                                <Button
                                  key={action?.actionCode}
                                  onClick={() => handleActions(action)}
                                  variant="outline"
                                  w="fit-content"
                                >
                                  {action?.action}
                                </Button>
                              );
                            }
                          })}
                        </HStack>
                      )}
                    </Hide>
                  </>
                )}
              </Stack>
            </Stack>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default ApplicationDetailsPage;
