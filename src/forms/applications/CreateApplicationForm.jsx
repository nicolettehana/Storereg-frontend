import React from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Heading,
  Hide,
  HStack,
  IconButton,
  Kbd,
  ListItem,
  OrderedList,
  Radio,
  Show,
  SimpleGrid,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  useSteps,
  useToast,
  VisuallyHidden,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import TextAreaField from "../../components/core/formik/TextAreaField";
import SelectField from "../../components/core/formik/SelectField";
import RadioGroupField from "../../components/core/formik/RadioGroupField";
import {
  MdOutlineArrowBack,
  MdOutlineArrowForward,
  MdOutlineInfo,
} from "react-icons/md";
import { useCreateBookingApplication } from "../../hooks/bookingQueries";
import dayjs from "dayjs";
import CheckBoxField from "../../components/core/formik/CheckBoxField";
import { useNavigate } from "react-router-dom";
import { downloadPDF } from "../../components/utils/blobHelper";
import ApplicationDetails from "../../pages/user/dashboard/details/ApplicationDetails";
import GenerateWarningForm from "./GenerateWarningForm";
import { useFetchUsersProfile } from "../../hooks/userQueries";
import ESignOrDownloadModal from "../../pages/user/dashboard/create/ESignOrDownloadModal";
import SubmitToForwardingOfficerForm from "./SubmitToForwardingOfficerForm";

const CreateApplicationForm = () => {
  // Constants
  const steps = [
    { title: "First Section", description: "Applicant Details" },
    { title: "Second Section", description: "Additional Details" },
    { title: "Third Section", description: "Additional Details" },
    { title: "Form Preview", description: "Review Application" },
  ];

  // Hooks
  const navigate = useNavigate();
  const toast = useToast();
  const [isLargerThanMd] = useMediaQuery("(min-width: 768px)");
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Disclosures
  const warningDisclosure = useDisclosure();
  const eProposalDisclosure = useDisclosure();
  const choiceDisclosure = useDisclosure();

  // Queries
  const profileQuery = useFetchUsersProfile();
  const createBookingQuery = useCreateBookingApplication(
    (response) => {
      downloadPDF(response.data, `Generated-Quarter-Booking-Application`);
      warningDisclosure.onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description:
          response.data.detail || "Application generated successfully",
      });

      // localStorage.removeItem("saved_form");
      navigate("/user/dashboard");

      return response;
    },
    (error) => {
      warningDisclosure.onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail,
      });

      return error;
    }
  );

  // Formik
  const savedForm = JSON.parse(localStorage.getItem("saved_form"));
  const initialValues =
    savedForm !== null
      ? savedForm
      : {
          name: profileQuery?.data?.data?.name || "",
          basicPay: "",
          scaleOfPay: "",
          designation: profileQuery?.data?.data?.designation || "",
          departmentOrDirectorate: profileQuery?.data?.data?.department || "",
          officeAddress: "",
          officeTelephone: "",
          dateEmployed: "",
          dateOfRetirement: "",
          gender: "",
          maritalStatus: "",
          employmentStatus: "",
          spouseAccommodation: "",
          accommodationDetails: "",
          service: "",
          otherServicesDetails: "",
          centralDeputation: "",
          deputationPeriod: "",
          debarred: "",
          debarredUptoDate: "",
          ownHouse: "",
          particularsOfHouse: "",
          houseBuildingAdvance: "",
          loanYear: "",
          houseConstructed: "",
          houseLocation: "",
          presentAddress: "",
          deptHasQuarter: "",
          reasonDeptQuarter: "",
          declaration: false,
        };

  const firstStepSchema = yup.object({
    name: yup.string().required("Full Name is required"),
    basicPay: yup
      .number()
      .typeError("Basic Pay should only include numeric characters")
      .required("Basic Pay is required"),
    scaleOfPay: yup.string().required("Pay Level is required"),
    designation: yup.string().required("Designation is required"),
    departmentOrDirectorate: yup
      .string()
      .required("Department/Directorate is required"),
    officeAddress: yup.string().required("Office Address is required"),
    officeTelephone: yup
      .number()
      .typeError("Telephone number should only include numeric characters")
      .required("Office Telephone Number is required"),
    dateEmployed: yup
      .date()
      .max(
        dayjs().format("YYYY-MM-DD"),
        "Date Employeed should not be greater than today's date"
      )
      .required("Date Employed is required"),
    dateOfRetirement: yup
      .date()
      .min(
        dayjs().format("YYYY-MM-DD"),
        "Date of Retirement should not be lesser than today's date"
      )
      .required("Date of Retirement is required"),
  });

  const secondStepSchema = yup.object({
    gender: yup.string().required("Gender is required"),
    maritalStatus: yup.string().when("gender", {
      is: "F",
      then: () => yup.string().required("Marital Status is required"),
      otherwise: () => yup.string().nullable(),
    }),
    employmentStatus: yup.string().required("Employment Status is required"),
    spouseAccommodation: yup
      .string()
      .required("Accommodation Alloted is required"),
    accommodationDetails: yup.string().when("spouseAccommodation", {
      is: "Y",
      then: () => yup.string().required("Accommodation Details is required"),
      otherwise: () => yup.string().nullable(),
    }),
    service: yup.string().required("Service is required"),
    otherServicesDetails: yup.string().when("service", {
      is: "Others",
      then: () => yup.string().required("Other Services (Details) is required"),
      otherwise: () => yup.string().nullable(),
    }),
    centralDeputation: yup
      .string()
      .required("Deputation from Central Govt. is required"),
    deputationPeriod: yup.number().when("centralDeputation", {
      is: "Y",
      then: () =>
        yup
          .number()
          .typeError("Period of Deputation must be a number")
          .required("Period of Deputation is required"),
      otherwise: () => yup.number().nullable(),
    }),
  });

  const thirdStepSchema = yup.object({
    debarred: yup.string().required("This field is required"),
    debarredUptoDate: yup.string().when("debarred", {
      is: "Y",
      then: () => yup.string().required("Debarred duration is required"),
      otherwise: () => yup.string().nullable(),
    }),
    ownHouse: yup.string().required("Please select an option"),
    particularsOfHouse: yup.string().when("ownHouse", {
      is: "Y",
      then: () => yup.string().required("Particulars is required"),
      otherwise: () => yup.string().nullable(),
    }),
    houseBuildingAdvance: yup.string().required("Please select an option"),
    loanYear: yup.number().when("houseBuildingAdvance", {
      is: "Y",
      then: () =>
        yup
          .number()
          .typeError("Year must be a number")
          .required("Please fill in this field"),
      otherwise: () => yup.number().nullable(),
    }),
    houseConstructed: yup.string().required("Please select an option"),
    houseLocation: yup.string().when("houseConstructed", {
      is: "Y",
      then: () => yup.string().required("House Location is required"),
      otherwise: () => yup.string().nullable(),
    }),
    presentAddress: yup.string().required("Present Address is required"),
    deptHasQuarter: yup.string().required("Please select an option"),
    reasonDeptQuarter: yup.string().when("deptHasQuarter", {
      is: "Y",
      then: () => yup.string().required("Please state a reason"),
      otherwise: () => yup.string().nullable(),
    }),
    declaration: yup
      .boolean()
      .oneOf(
        [true],
        "Please confirm your agreement with the declaration before submitting the form"
      )
      .required(
        "Please confirm your agreement with the declaration before submitting the form"
      ),
  });

  const validationSchema =
    activeStep === 0
      ? firstStepSchema
      : activeStep === 1
      ? secondStepSchema
      : thirdStepSchema;

  const onSubmit = (values) => {
    const formData = { ...values };

    // localStorage.setItem("saved_form", JSON.stringify(formData));
    delete formData.declaration;

    createBookingQuery.mutate(formData);
  };

  // Handlers
  const handleNextStep = (formik) => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setActiveStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    });
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSaveAndGoNext = (formik) => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length !== 0) {
        toast({
          isClosable: true,
          duration: 5000,
          position: "top-right",
          status: "warning",
          title: "Form Not Saved",
          description:
            "Please fill in all required fields before advancing to the next step",
        });
      } else {
        // localStorage.setItem("saved_form", JSON.stringify(formik.values));

        toast({
          isClosable: true,
          duration: 3000,
          position: "top-right",
          status: "success",
          title: "Form Saved",
          description: "Draft saved successfully",
        });

        setActiveStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      initialTouched={{
        declaration: true,
      }}
    >
      {(formik) => {
        // Clean Data
        // Step 2
        if (formik.values.gender === "M") formik.values.maritalStatus = "";
        if (formik.values.spouseAccommodation === "N")
          formik.values.accommodationDetails = "";
        if (formik.values.service !== "Others")
          formik.values.otherServicesDetails = "";
        if (formik.values.centralDeputation === "N")
          formik.values.deputationPeriod = "";

        // Step 3
        if (formik.values.debarred === "N") formik.values.debarredUptoDate = "";
        if (formik.values.ownHouse === "N")
          formik.values.particularsOfHouse = "";
        if (formik.values.houseBuildingAdvance === "N")
          formik.values.loanYear = "";
        if (formik.values.houseConstructed === "N")
          formik.values.houseLocation = "";
        if (formik.values.deptHasQuarter === "N")
          formik.values.reasonDeptQuarter = "";

        return (
          <>
            {/* Modals */}
            <GenerateWarningForm
              formik={formik}
              query={createBookingQuery}
              isOpen={warningDisclosure.isOpen}
              onClose={warningDisclosure.onClose}
            />

            <SubmitToForwardingOfficerForm
              formData={formik.values}
              isOpen={eProposalDisclosure.isOpen}
              onClose={eProposalDisclosure.onClose}
            />

            <ESignOrDownloadModal
              isOpen={choiceDisclosure.isOpen}
              onClose={choiceDisclosure.onClose}
              warningDisclosure={warningDisclosure}
              eProposalDisclosure={eProposalDisclosure}
            />

            {/* Form */}
            <Form>
              <Stack spacing={8} divider={<Divider />}>
                <Stepper
                  index={activeStep}
                  orientation={isLargerThanMd ? "horizontal" : "vertical"}
                  h={{ base: "250px", md: "auto" }}
                  gap={{ base: 0, md: 4 }}
                >
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>

                      <Box flexShrink="0">
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                      </Box>

                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>

                {/* STEP 1 */}
                {activeStep === 0 && (
                  <Stack spacing={8} divider={<Divider />}>
                    {/* ALERT */}
                    <Alert status="info" rounded="md">
                      <Stack>
                        <HStack spacing={0}>
                          <AlertIcon />
                          <AlertTitle>
                            <Text>Instructions for Completing the Form:</Text>
                            <VisuallyHidden>
                              Instructions for Completing the Form:
                            </VisuallyHidden>
                          </AlertTitle>
                        </HStack>
                        <AlertDescription>
                          <Stack pl={8}>
                            <OrderedList>
                              <ListItem>
                                <Tooltip
                                  label={
                                    <Stack p={2}>
                                      <Text>
                                        To input special characters like Ñ, ñ, Ï
                                        or ï, press and hold the Alt key and
                                        type these number using the numpad keys.
                                      </Text>
                                      <Stack spacing={0}>
                                        <Text>
                                          <Kbd>alt</Kbd> + <Kbd>165</Kbd> for Ñ
                                        </Text>
                                        <Text>
                                          <Kbd>alt</Kbd> + <Kbd>164</Kbd> for ñ
                                        </Text>
                                        <Text>
                                          <Kbd>alt</Kbd> + <Kbd>0207</Kbd> for Ï
                                        </Text>
                                        <Text>
                                          <Kbd>alt</Kbd> + <Kbd>0239</Kbd> for ï
                                        </Text>
                                      </Stack>
                                    </Stack>
                                  }
                                >
                                  <HStack>
                                    <Text fontWeight="bold">
                                      Fill out the form online.
                                    </Text>
                                    <MdOutlineInfo />
                                  </HStack>
                                </Tooltip>
                              </ListItem>
                              <ListItem>
                                <Text fontWeight="bold">
                                  Click "Generate" to download the completed
                                  form.
                                </Text>
                              </ListItem>
                              <ListItem>
                                <Text fontWeight="bold">
                                  Sign the printed form and upload the signed
                                  copy.
                                </Text>
                              </ListItem>
                            </OrderedList>

                            <Text>
                              <strong>Note:</strong> To check the status of your
                              application, log in to your account. Updates will
                              be provided as your application progresses
                            </Text>
                          </Stack>
                        </AlertDescription>
                      </Stack>
                    </Alert>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <InputField
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        readOnly
                      />

                      <InputField
                        name="designation"
                        label="Designation"
                        placeholder="Enter your designation"
                        readOnly
                      />

                      <InputField
                        name="departmentOrDirectorate"
                        label="Department/Directorate"
                        placeholder="Enter your department/directorate"
                        readOnly
                      />
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <InputField
                        name="officeAddress"
                        label="Office Address"
                        placeholder="Enter your office address"
                      />

                      <InputField
                        name="officeTelephone"
                        label="Office Telephone Number"
                        placeholder="Enter your office telephone number"
                      />

                      <InputField
                        name="basicPay"
                        label="Basic Pay (as on date of application)"
                        placeholder="Enter your basic pay"
                      />

                      <InputField
                        name="scaleOfPay"
                        label="Pay Level (as on date of application)"
                        placeholder="Enter your level (ex. Level-7)"
                      />
                    </SimpleGrid>

                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      gap={4}
                      alignItems="end"
                    >
                      <InputField
                        type="date"
                        w="fit-content"
                        name="dateEmployed"
                        max={dayjs().format("YYYY-MM-DD")}
                        label="Date from which continuously employed under State Govt. including Foreign Service"
                      />

                      <InputField
                        type="date"
                        w="fit-content"
                        name="dateOfRetirement"
                        min={dayjs().format("YYYY-MM-DD")}
                        label="Date of Retirement on Superannuation"
                      />
                    </SimpleGrid>

                    <HStack justifyContent="end">
                      <Hide below="sm">
                        <Button
                          aria-label="Next Section"
                          type="button"
                          variant="outline"
                          rightIcon={<MdOutlineArrowForward size={20} />}
                          onClick={() => handleNextStep(formik)}
                        >
                          Next
                        </Button>
                      </Hide>

                      <Show below="sm">
                        <IconButton
                          type="button"
                          variant="outline"
                          size="lg"
                          icon={<MdOutlineArrowForward size={20} />}
                          onClick={() => handleNextStep(formik)}
                        />
                      </Show>

                      {/* <Button
                        type="button"
                        variant="brand"
                        w={{ base: "full", sm: "fit-content" }}
                        size={{ base: "lg", sm: "md" }}
                        onClick={() => handleSaveAndGoNext(formik)}
                      >
                        Save and Go Next
                      </Button> */}
                    </HStack>
                  </Stack>
                )}

                {/* STEP 2 */}
                {activeStep === 1 && (
                  <Stack spacing={8} divider={<Divider />}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <RadioGroupField name="gender" label="Gender">
                        <HStack>
                          <Radio value="M">Male</Radio>
                          <Radio value="F">Female</Radio>
                        </HStack>
                      </RadioGroupField>

                      {formik.values.gender === "F" && (
                        <RadioGroupField
                          name="maritalStatus"
                          label="Marital Status"
                        >
                          <HStack>
                            <Radio value="Single">Single</Radio>
                            <Radio value="Married">Married</Radio>
                          </HStack>
                        </RadioGroupField>
                      )}
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <SelectField
                        name="employmentStatus"
                        label="Employment Status"
                        placeholder="Select an option"
                      >
                        <option value="Temporary">Temporary</option>
                        <option value="Quasi Permanent">Quasi Permanent</option>
                        <option value="Permanent">Permanent</option>
                      </SelectField>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <RadioGroupField
                        name="spouseAccommodation"
                        label="Are you/is your spouse occupying accommodation allotted by Estates/Departmental Officer?"
                      >
                        <HStack>
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </HStack>
                      </RadioGroupField>

                      {formik.values.spouseAccommodation === "Y" && (
                        <TextAreaField
                          name="accommodationDetails"
                          label="If yes, fill the name of allotted Designation and Address (including the type and number of the flat)"
                          placeholder="Type here..."
                        />
                      )}
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <SelectField
                        name="service"
                        label="Service to which officer belongs"
                        placeholder="Select an option"
                      >
                        <option value="I.A.S/I.P.S/I.F.S">
                          I.A.S/I.P.S/I.F.S
                        </option>
                        <option value="M.C.S/M.P.S">M.C.S/M.P.S</option>
                        <option value="Others">Others</option>
                      </SelectField>

                      {formik.values.service === "Others" && (
                        <TextAreaField
                          name="otherServicesDetails"
                          label="Other Services (Details)"
                          placeholder="Type here..."
                        />
                      )}
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <RadioGroupField
                        name="centralDeputation"
                        label="Are you on deputation from Central Government?"
                      >
                        <HStack>
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </HStack>
                      </RadioGroupField>

                      {formik.values.centralDeputation === "Y" && (
                        <InputField
                          name="deputationPeriod"
                          label="If yes what is the period of deputation"
                          placeholder="Enter your period of deputation"
                        />
                      )}
                    </SimpleGrid>

                    <HStack justifyContent="end">
                      <Hide below="sm">
                        <Button
                          aria-label="Previous Section"
                          type="button"
                          variant="outline"
                          leftIcon={<MdOutlineArrowBack size={20} />}
                          onClick={handlePrevStep}
                        >
                          Prev
                        </Button>

                        <Button
                          aria-label="Next Section"
                          type="button"
                          variant="outline"
                          rightIcon={<MdOutlineArrowForward size={20} />}
                          onClick={() => handleNextStep(formik)}
                        >
                          Next
                        </Button>
                      </Hide>

                      <Show below="sm">
                        <IconButton
                          type="button"
                          variant="outline"
                          size="lg"
                          icon={<MdOutlineArrowBack size={20} />}
                          onClick={handlePrevStep}
                        />

                        <IconButton
                          type="button"
                          variant="outline"
                          size="lg"
                          icon={<MdOutlineArrowForward size={20} />}
                          onClick={() => handleNextStep(formik)}
                        />
                      </Show>

                      {/* <Button
                        type="button"
                        variant="brand"
                        w={{ base: "full", sm: "fit-content" }}
                        size={{ base: "lg", sm: "md" }}
                        onClick={() => handleSaveAndGoNext(formik)}
                      >
                        Save and Go Next
                      </Button> */}
                    </HStack>
                  </Stack>
                )}

                {/* STEP 3 */}
                {activeStep === 2 && (
                  <Stack spacing={8} divider={<Divider />}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <RadioGroupField
                        name="debarred"
                        label="Are you debarred from allotment of Govt. residence?"
                      >
                        <HStack>
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </HStack>
                      </RadioGroupField>

                      {formik.values.debarred === "Y" && (
                        <InputField
                          type="date"
                          w="fit-content"
                          name="debarredUptoDate"
                          label="If yes upto which date"
                        />
                      )}
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <RadioGroupField
                        name="ownHouse"
                        label="Do you/your spouse own a house within Shillong?"
                      >
                        <HStack>
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </HStack>
                      </RadioGroupField>

                      {formik.values.ownHouse === "Y" && (
                        <TextAreaField
                          name="particularsOfHouse"
                          label="If yes give particulars of the house"
                          placeholder="Type here..."
                        />
                      )}
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <RadioGroupField
                        name="houseBuildingAdvance"
                        label="Have you taken House Building Advance?"
                      >
                        <HStack>
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </HStack>
                      </RadioGroupField>

                      {formik.values.houseBuildingAdvance === "Y" && (
                        <InputField
                          type="text"
                          name="loanYear"
                          label="If so, indicate year in which loan was taken"
                          placeholder="YYYY"
                        />
                      )}
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <RadioGroupField
                        name="houseConstructed"
                        label="Have you constructed a house?"
                      >
                        <HStack>
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </HStack>
                      </RadioGroupField>

                      {formik.values.houseConstructed === "Y" && (
                        <TextAreaField
                          type="text"
                          name="houseLocation"
                          label="If so, indicate location of the house"
                          placeholder="Type here..."
                        />
                      )}
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <TextAreaField
                        name="presentAddress"
                        label="Where are you staying at present?"
                        placeholder="Type here..."
                      />
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <RadioGroupField
                        name="deptHasQuarter"
                        label="Does your department under which you are working has quarter at Shillong?"
                      >
                        <HStack>
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </HStack>
                      </RadioGroupField>

                      {formik.values.deptHasQuarter === "Y" && (
                        <TextAreaField
                          name="reasonDeptQuarter"
                          label="If yes, reason why you are not allotted departmental quarters"
                        />
                      )}
                    </SimpleGrid>

                    <Stack
                      bg="paperSecondary"
                      border="1px"
                      borderColor="border"
                      rounded="xl"
                      px={6}
                      py={4}
                      spacing={4}
                    >
                      <Heading
                        size="sm"
                        textTransform="uppercase"
                        letterSpacing="widest"
                      >
                        Declaration
                      </Heading>
                      <OrderedList>
                        <ListItem>
                          I abide by the allotment of Meghalaya Government
                          Residence (General Pool) Rules, 1990 as amended from
                          time to time or relevant Allotment Rules application.
                        </ListItem>
                        <ListItem>
                          I am aware of the penalties to be imposed in the event
                          of refusal of acceptance of allotment of accommodation
                          of the entitled type of furnishing of false
                          information.
                        </ListItem>
                        <ListItem>
                          I agree to vacate the quarter on transfer or
                          retirement, or whatever required by General
                          Administration Department.
                        </ListItem>
                      </OrderedList>

                      <CheckBoxField
                        name="declaration"
                        label="I hereby confirm that I agree with the declaration."
                      />
                    </Stack>

                    <HStack justifyContent="end">
                      <Hide below="sm">
                        <Button
                          aria-label="Previous Section"
                          type="button"
                          variant="outline"
                          leftIcon={<MdOutlineArrowBack size={20} />}
                          onClick={handlePrevStep}
                        >
                          Prev
                        </Button>

                        <Button
                          aria-label="Next Section"
                          type="button"
                          variant="outline"
                          rightIcon={<MdOutlineArrowForward size={20} />}
                          onClick={() => handleNextStep(formik)}
                        >
                          Next
                        </Button>
                      </Hide>

                      <Show below="sm">
                        <IconButton
                          type="button"
                          variant="outline"
                          size="lg"
                          icon={<MdOutlineArrowBack size={20} />}
                          onClick={handlePrevStep}
                        />

                        <IconButton
                          type="button"
                          variant="outline"
                          size="lg"
                          icon={<MdOutlineArrowForward size={20} />}
                          onClick={() => handleNextStep(formik)}
                        />
                      </Show>

                      {/* <Button
                        type="button"
                        variant="brand"
                        w={{ base: "full", sm: "fit-content" }}
                        size={{ base: "lg", sm: "md" }}
                        onClick={() => handleSaveAndGoNext(formik)}
                      >
                        Save and Go Next
                      </Button> */}
                    </HStack>
                  </Stack>
                )}

                {activeStep === 3 && (
                  <Stack spacing={8}>
                    <ApplicationDetails isPreview={true} row={formik.values} />
                    <HStack justifyContent="end">
                      <Hide below="sm">
                        <Button
                          aria-label="Previous Section"
                          type="button"
                          variant="outline"
                          leftIcon={<MdOutlineArrowBack size={20} />}
                          onClick={handlePrevStep}
                        >
                          Prev
                        </Button>
                      </Hide>

                      <Show below="sm">
                        <IconButton
                          aria-label="Previous Section"
                          type="button"
                          variant="outline"
                          size="lg"
                          icon={<MdOutlineArrowBack size={20} />}
                          onClick={handlePrevStep}
                        />
                      </Show>

                      <Button
                        aria-label="Submit form"
                        type="button"
                        variant="brand"
                        w={{ base: "full", sm: "fit-content" }}
                        size={{ base: "lg", sm: "md" }}
                        // onClick={warningDisclosure.onOpen}
                        onClick={choiceDisclosure.onOpen}
                      >
                        Submit
                      </Button>
                    </HStack>
                  </Stack>
                )}
              </Stack>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default CreateApplicationForm;
