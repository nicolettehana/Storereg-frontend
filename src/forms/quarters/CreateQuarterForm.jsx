import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Button,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  useToast,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import {
  useCreateQuarter,
  useFetchBlocksByDistrictCode,
  useFetchDepartments,
  useFetchDistricts,
  useFetchQuarterOccupancyStatusByStatusCode,
  useFetchQuarterStatus,
  useFetchQuarterTypes,
  useFetchVillageByBlockCode,
} from "../../hooks/quartersQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateQuarterAndAddOccupants } from "../../hooks/occpantsQueries";
import { useNavigate } from "react-router-dom";

const CreateQuarterForm = () => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const deptQuery = useFetchDepartments();
  const districtQuery = useFetchDistricts();
  const blockQuery = useFetchBlocksByDistrictCode();
  const villageQuery = useFetchVillageByBlockCode();
  const occupancyQuery = useFetchQuarterOccupancyStatusByStatusCode();

  const quarterStatusQuery = useFetchQuarterStatus();
  const quarterTypesQuery = useFetchQuarterTypes();

  const createQuery = useCreateQuarter(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-quarters-by-type"] });
      navigate("/est/quarters");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Quarter created successfully",
      });
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
          "Oops! Something went wrong. Couldn't create quarter.",
      });
      return error;
    }
  );

  const createAndAddOccupantQuery = useCreateQuarterAndAddOccupants(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-quarters-by-type"] });
      navigate("/est/quarters");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description:
          response.data.detail || "Quarter and occupants added successfully",
      });
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
          "Oops! Something went wrong. Couldn't add quarter and occupants.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    quarterTypeCode: "",
    quarterNo: "",
    quarterName: "",
    physicalStatus: "",
    quarterStatus: "",
    departmentCode: "",
    officeCode: "",
    assetType: "Building",
    assetDescription: "",
    districtCode: "",
    blockCode: "",
    villageCode: "",
    location: "",
    latitude: "",
    longitude: "",
    landAssetId: "",
    assetCategory: "Residential Quarters",
    structureType: "",
    inaugurationDate: "",
    builtUpArea: "",
    managedBy: "",
    // Occupants
    name: "",
    designation: "",
    gender: "",
    allotmentDate: "",
    deptOffice: "",
    payScale: "",
    occupationDate: "",
    retirementDate: "",
  };

  const validationSchema = yup.object({
    quarterTypeCode: yup.string().required("Quarter type is required"),
    quarterNo: yup.string().required("Quarter no. is required"),
    quarterName: yup.string().required("Quarter name is required"),
    physicalStatus: yup.string().required("Quarter Status is required"),
    quarterStatus:
      occupancyQuery?.data?.data?.length !== 0
        ? yup.string().required("Occupancy Status is required")
        : yup.string().nullable(),
    departmentCode: yup.string().nullable(),
    officeCode: yup.string().nullable(),
    assetType: yup.string().nullable(),
    assetDescription: yup.string().nullable(),
    districtCode: yup.string().nullable(),
    blockCode: yup.string().nullable(),
    villageCode: yup.string().nullable(),
    location: yup.string().required("Other Location is required"),
    latitude: yup
      .string()
      .matches(/^(\-?\d+(\.\d+)?)$/, "Invalid latitude format")
      .nullable(),
    longitude: yup
      .string()
      .matches(/^(\-?\d+(\.\d+)?)$/, "Invalid longitude format")
      .nullable(),
    assetCategory: yup.string().nullable(),
    structureType: yup.string().nullable(),
    inaugurationDate: yup.date().nullable(),
    builtUpArea: yup.string().nullable(),
    managedBy: yup.string().nullable(),
    // Occupants
    name: yup.string().when("quarterStatus", {
      is: (value) => value === "1" || value === "2",
      then: () => yup.string().required("Name is required"),
      otherwise: () => yup.string().nullable(),
    }),
    designation: yup.string().when("quarterStatus", {
      is: (value) => value === "1" || value === "2",
      then: () => yup.string().required("Designation is required"),
      otherwise: () => yup.string().nullable(),
    }),
    gender: yup.string().when("quarterStatus", {
      is: (value) => value === "1" || value === "2",
      then: () => yup.string().required("Gender is required"),
      otherwise: () => yup.string().nullable(),
    }),
    allotmentDate: yup.date().nullable(),
    deptOffice: yup.string().nullable(),
    payScale: yup.string().nullable(),
    occupationDate: yup.date().nullable(),
    retirementDate: yup.date().nullable(),
  });

  const onSubmit = (values) => {
    const formData = { ...values };

    formData.departmentCode = parseInt(formData.departmentCode);
    formData.officeCode = parseInt(formData.officeCode);

    formData.districtCode = parseInt(formData.districtCode);
    formData.blockCode = parseInt(formData.blockCode);
    formData.villageCode = parseInt(formData.villageCode);

    formData.latitude = parseFloat(formData.latitude);
    formData.longitude = parseFloat(formData.longitude);

    if (formData.quarterStatus === "1" || formData.quarterStatus === "2") {
      createAndAddOccupantQuery.mutate(formData);
    } else {
      delete formData.name;
      delete formData.designation;
      delete formData.gender;
      delete formData.allotmentDate;
      delete formData.deptOffice;
      delete formData.payScale;
      delete formData.occupationDate;
      delete formData.retirementDate;
      createQuery.mutate(formData);
    }
  };

  // Options
  const structureTypeList = [
    { label: "Assam Type", value: "Assam Type" },
    { label: "Pre Fabricated", value: "Pre Fabricated" },
    { label: "RCC", value: "RCC" },
  ];

  const managedByList = [
    { label: "Department", value: "Department" },
    { label: "Agency", value: "Agency" },
    { label: "Private Entity", value: "Private Entity" },
  ];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Stack as={Form} spacing={8}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <SelectField
                name="quarterTypeCode"
                label="Quarter Type"
                placeholder="Select an option"
                onChange={(e) => {
                  const typeCode = e.target.value;
                  const type = quarterTypesQuery?.data?.data?.find(
                    (row) => row.code === typeCode
                  )?.quarterType;
                  formik.setFieldValue("quarterTypeCode", typeCode);
                  formik.setFieldValue(
                    "assetDescription",
                    `${type}, ${formik.values.quarterNo}, ${formik.values.quarterName}`
                  );
                }}
              >
                {quarterTypesQuery?.data?.data?.map((row) => (
                  <option key={row?.code} value={row?.code}>
                    {row?.quarterType}
                  </option>
                ))}
              </SelectField>

              <InputField
                name="quarterNo"
                label="Quarter No."
                placeholder="Enter the quarter no."
                onChange={(e) => {
                  const quarterNo = e.target.value;
                  const type = quarterTypesQuery?.data?.data?.find(
                    (row) => `${row.code}` === formik.values.quarterTypeCode
                  )?.quarterType;

                  formik.setFieldValue("quarterNo", quarterNo);
                  formik.setFieldValue(
                    "assetDescription",
                    `${type}, ${quarterNo}, ${formik.values.quarterName}`
                  );
                }}
              />

              <InputField
                name="quarterName"
                label="Quarter Name"
                placeholder="Enter the quarter name"
                onChange={(e) => {
                  const quarterName = e.target.value;
                  const type = quarterTypesQuery?.data?.data?.find(
                    (row) => `${row.code}` === formik.values.quarterTypeCode
                  )?.quarterType;

                  formik.setFieldValue("quarterName", quarterName);
                  formik.setFieldValue(
                    "assetDescription",
                    `${type}, ${formik.values.quarterNo}, ${quarterName}`
                  );
                }}
              />

              <SelectField
                name="physicalStatus"
                label="Quarter Status"
                placeholder="Select an option"
                onChange={(e) => {
                  const quarterStatus = e.target.value;
                  formik.setFieldValue("physicalStatus", quarterStatus);
                  formik.setFieldValue("quarterStatus", "");
                  if (quarterStatus) {
                    occupancyQuery.mutate({ quarterStatus });
                  }
                }}
              >
                {quarterStatusQuery?.data?.data?.map((row) => (
                  <option
                    key={row?.physicalStatusCode}
                    value={row?.physicalStatusCode}
                  >
                    {row?.physicalStatus}
                  </option>
                ))}
              </SelectField>

              {occupancyQuery?.data?.data?.length !== 0 && (
                <SelectField
                  name="quarterStatus"
                  label="Occupancy Status"
                  placeholder="Select an option"
                >
                  {occupancyQuery?.data?.data?.map((row) => (
                    <option
                      key={row?.occupancyStatusCode}
                      value={row?.occupancyStatusCode}
                    >
                      {row?.occupancyStatus}
                    </option>
                  ))}
                </SelectField>
              )}
            </SimpleGrid>

            {/* Quarter Status is Occupied */}
            {formik.values.quarterStatus === "1" ||
            formik.values.quarterStatus === "2" ? (
              <Stack spacing={4}>
                <HStack spacing={4}>
                  <Heading size="sm" flexShrink={0}>
                    Occupant Details
                  </Heading>
                  <Divider />
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <InputField
                    type="text"
                    name="name"
                    label="Name"
                    placeholder="Enter the occupant's name"
                  />

                  <InputField
                    type="text"
                    name="designation"
                    label="Designation"
                    placeholder="Enter the occupant's designation"
                  />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <SelectField
                    name="gender"
                    label="Gender"
                    placeholder="Select an option"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </SelectField>

                  <InputField
                    type="text"
                    name="deptOffice"
                    label="Department/Office"
                    placeholder="Enter the occupant's department/office"
                    isRequired={false}
                  />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <InputField
                    type="text"
                    name="payScale"
                    label="Pay Scale"
                    placeholder="Enter the occupant's pay scale"
                    isRequired={false}
                  />

                  <InputField
                    type="date"
                    name="allotmentDate"
                    label="Allotment Date"
                    // max={dayjs().format("YYYY-MM-DD")}
                    isRequired={false}
                  />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <InputField
                    type="date"
                    name="occupationDate"
                    label="Occupation Date"
                    //   max={dayjs().format("YYYY-MM-DD")}
                    isRequired={false}
                  />

                  <InputField
                    type="date"
                    name="retirementDate"
                    label="Retirement Date"
                    //   max={dayjs().format("YYYY-MM-DD")}
                    isRequired={false}
                  />
                </SimpleGrid>
              </Stack>
            ) : null}

            <HStack spacing={4}>
              <Heading size="sm" flexShrink={0}>
                Asset Register
              </Heading>
              <Divider />
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <SelectField
                name="departmentCode"
                label="Department"
                placeholder="Select a department"
                isRequired={false}
              >
                {deptQuery?.data?.data?.map((row) => (
                  <option key={row?.deptCode} value={row?.deptCode}>
                    {row?.deptName}
                  </option>
                ))}
              </SelectField>

              <SelectField
                name="officeCode"
                label="Office"
                placeholder="Select an office"
                isRequired={false}
              >
                {deptQuery?.data?.data
                  ?.find(
                    (row) =>
                      `${row?.deptCode}` === `${formik.values.departmentCode}`
                  )
                  ?.offices?.map((row) => (
                    <option key={row?.officeCode} value={row?.officeCode}>
                      {row?.officeName}
                    </option>
                  ))}
              </SelectField>

              <InputField
                name="assetType"
                label="Asset Type"
                placeholder="Enter the asset type"
                isRequired={false}
              />

              <InputField
                name="assetDescription"
                label="Asset Description"
                placeholder="Enter the asset description"
                isRequired={false}
              />
            </SimpleGrid>

            <HStack spacing={4}>
              <Heading size="sm" flexShrink={0}>
                Location
              </Heading>
              <Divider />
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <SelectField
                name="districtCode"
                label="District"
                placeholder="Select a district"
                isRequired={false}
                onChange={(e) => {
                  const districtCode = e.target.value;
                  formik.setFieldValue("districtCode", districtCode);
                  if (districtCode) {
                    blockQuery.mutate({ districtCode });
                  }
                }}
              >
                {districtQuery?.data?.data?.map((row) => (
                  <option key={row?.lgdCode} value={row?.lgdCode}>
                    {row?.districtName}
                  </option>
                ))}
              </SelectField>

              <SelectField
                name="blockCode"
                label="Block/Municipality/Cantonment"
                placeholder="Select a block"
                isRequired={false}
                onChange={(e) => {
                  const blockCode = e.target.value;
                  formik.setFieldValue("blockCode", blockCode);
                  if (blockCode) {
                    villageQuery.mutate({ blockCode });
                  }
                }}
              >
                {blockQuery?.data?.data?.map((row) => (
                  <option key={row?.blockCode} value={row?.blockCode}>
                    {row?.blockName}
                  </option>
                ))}
              </SelectField>

              <SelectField
                name="villageCode"
                label="Village/Locality"
                placeholder="Select a village"
                isRequired={false}
              >
                {villageQuery?.data?.data?.map((row) => (
                  <option key={row?.villageCode} value={row?.villageCode}>
                    {row?.villageName}
                  </option>
                ))}
              </SelectField>

              <InputField
                name="location"
                label="Other Location"
                placeholder="Enter other location"
              />

              <InputField
                name="latitude"
                label="Latitude"
                placeholder="Enter the latitude"
                isRequired={false}
              />

              <InputField
                name="longitude"
                label="Longitude"
                placeholder="Enter the longitude"
                isRequired={false}
              />

              <InputField
                name="landAssetId"
                label="Land Asset ID"
                placeholder="Enter the land asset id"
                isRequired={false}
              />
            </SimpleGrid>

            <HStack spacing={4}>
              <Heading size="sm" flexShrink={0}>
                Asset Details
              </Heading>
              <Divider />
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <InputField
                name="assetCategory"
                label="Asset Category"
                placeholder="Enter asset category"
                isRequired={false}
              />

              <SelectField
                name="structureType"
                label="Structure Type"
                placeholder="Select an option"
                isRequired={false}
              >
                {structureTypeList.map((row) => (
                  <option key={row?.value} value={row?.value}>
                    {row?.label}
                  </option>
                ))}
              </SelectField>

              <InputField
                type="date"
                name="inaugurationDate"
                label="Date of Inauguration"
                isRequired={false}
              />

              <InputField
                name="builtUpArea"
                label="Built Up Area (Sq Ft/Sq Meter/Acre)"
                placeholder="Enter built up area in (sq ft/sq meter/acre)"
                isRequired={false}
              />

              <SelectField
                name="managedBy"
                label="Managed By"
                placeholder="Select an option"
                isRequired={false}
              >
                {managedByList.map((row) => (
                  <option key={row?.value} value={row?.value}>
                    {row?.label}
                  </option>
                ))}
              </SelectField>
            </SimpleGrid>

            <HStack justifyContent="end">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                type="submit"
                variant="brand"
                isLoading={
                  createQuery.isPending || createAndAddOccupantQuery.isPending
                }
                loadingText="Saving"
              >
                Save
              </Button>
            </HStack>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default CreateQuarterForm;
