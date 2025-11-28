import { Divider, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

const ApplicationDetails = ({ isPreview = false, row }) => {
  return (
    <Stack spacing={4}>
      {/* 1ST */}
      <Stack
        spacing={4}
        divider={<Divider />}
        border="1px"
        borderColor="border"
        rounded="lg"
        p={{ base: 4, md: 8 }}
      >
        <Stack>
          {!isPreview && (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
              <Text color="body">Application Number</Text>
              <Text fontWeight="bold">{row?.appNo}</Text>
            </SimpleGrid>
          )}

          {!isPreview && (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
              <Text color="body">Applied Date</Text>
              <Text fontWeight="bold">
                {row?.uploadTimestamp
                  ? dayjs(row?.uploadTimestamp).format("DD MMM YYYY")
                  : "-"}
              </Text>
            </SimpleGrid>
          )}

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Full Name</Text>
            <Text fontWeight="bold">{row?.name}</Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Basic Pay</Text>
            <Text fontWeight="bold">{row?.basicPay}</Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Pay Level</Text>
            <Text fontWeight="bold">{row?.scaleOfPay}</Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Designation</Text>
            <Text fontWeight="bold">{row?.designation}</Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Department/Directorate</Text>
            <Text fontWeight="bold">{row?.departmentOrDirectorate}</Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Office Address</Text>
            <Text fontWeight="bold">{row?.officeAddress}</Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Office Telephone Number</Text>
            <Text fontWeight="bold">{row?.officeTelephone}</Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">
              Date from which continuously employed under State Govt. including
              Foreign Service
            </Text>
            <Text fontWeight="bold">
              {dayjs(row?.dateEmployed).format("DD MMM YYYY")}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Date of Retirement on Superannuation</Text>
            <Text fontWeight="bold">
              {dayjs(row?.dateOfRetirement).format("DD MMM YYYY")}
            </Text>
          </SimpleGrid>
        </Stack>
      </Stack>

      {/* 2ND */}
      <Stack
        spacing={4}
        divider={<Divider />}
        border="1px"
        borderColor="border"
        rounded="lg"
        p={{ base: 4, md: 8 }}
      >
        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Gender</Text>
            <Text fontWeight="bold">
              {row?.gender === "M" ? "Male" : "Female"}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Marital Status</Text>
            <Text fontWeight="bold">{row?.maritalStatus || "-"}</Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Employment Status</Text>
            <Text fontWeight="bold">{row?.employmentStatus}</Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">
              Are you/is your spouse occupying accommodation allotted by
              Estates/Departmental Officer
            </Text>
            <Text fontWeight="bold">
              {row?.spouseAccommodation === "Y" ? "Yes" : "No"}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">
              Designation and Address (including the type and number of the
              flat)
            </Text>
            <Text fontWeight="bold">{row?.accommodationDetails || "-"}</Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Service to which officer belongs</Text>
            <Text fontWeight="bold">{row?.service}</Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Other Services (Details)</Text>
            <Text fontWeight="bold">{row?.otherServicesDetails || "-"}</Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">
              Are you on deputation from Central Government?
            </Text>
            <Text fontWeight="bold">
              {row?.centralDeputation === "Y" ? "Yes" : "No"}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">What is the period of deputation</Text>
            <Text fontWeight="bold">{row?.deputationPeriod || "-"}</Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">
              Are you debarred from allotment of Govt. residence?
            </Text>
            <Text fontWeight="bold">
              {row?.debarred === "Y" ? "Yes" : "No"}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Upto which date</Text>
            <Text fontWeight="bold">
              {row?.debarredUptoDate
                ? dayjs(row?.debarredUptoDate).format("DD MMM YYYY")
                : "-"}
            </Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">
              Do you/your spouse own a house within Shillong?
            </Text>
            <Text fontWeight="bold">
              {row?.ownHouse === "Y" ? "Yes" : "No"}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Particulars of the house</Text>
            <Text fontWeight="bold">{row?.particularsOfHouse || "-"}</Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Have you taken House Building Advance?</Text>
            <Text fontWeight="bold">
              {row?.houseBuildingAdvance === "Y" ? "Yes" : "No"}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Year in which loan was taken</Text>
            <Text fontWeight="bold">{row?.loanYear || "-"}</Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Have you constructed a house?</Text>
            <Text fontWeight="bold">
              {row?.houseConstructed === "Y" ? "Yes" : "No"}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Location of the house</Text>
            <Text fontWeight="bold">{row?.houseLocation || "-"}</Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">Where are you staying at present?</Text>
            <Text fontWeight="bold">{row?.presentAddress}</Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">
              Does your department under which you are working has quarter at
              Shillong?
            </Text>
            <Text fontWeight="bold">
              {row?.deptHasQuarter === "Y" ? "Yes" : "No"}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, md: 4 }}>
            <Text color="body">
              Reason why you are not allotted departmental quarters
            </Text>
            <Text fontWeight="bold">{row?.reasonDeptQuarter || "-"}</Text>
          </SimpleGrid>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ApplicationDetails;
