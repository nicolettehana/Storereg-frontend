import React from "react";
import { Badge, Tooltip } from "@chakra-ui/react";

const Status = ({ label, description }) => {
  switch (label) {
    case "Allotted":
      return (
        <Tooltip label={description}>
          <Badge colorScheme="teal" w="fit-content">
            {label}
          </Badge>
        </Tooltip>
      );
    case "Draft":
      return (
        <Tooltip label={description}>
          <Badge w="fit-content">{label}</Badge>
        </Tooltip>
      );
    case "Declined":
    case "Cancelled":
    case "Discarded":
      return (
        <Tooltip label={description}>
          <Badge colorScheme="red" w="fit-content">
            {label}
          </Badge>
        </Tooltip>
      );
    default:
      return (
        <Tooltip label={description}>
          <Badge colorScheme="brand" w="fit-content">
            {label}
          </Badge>
        </Tooltip>
      );
  }
};

export default Status;
