import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react";
import { MdOutlineFilterList } from "react-icons/md";

const DateFilter = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  setPageNumber,
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" leftIcon={<MdOutlineFilterList size={20} />}>
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverHeader>Date Filter</PopoverHeader>
        <PopoverBody>
          <Stack>
            <FormControl>
              <FormLabel htmlFor="fromDate">From Date</FormLabel>
              <Input
                type="date"
                name="fromDate"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPageNumber(0);
                }}
                max={toDate}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="toDate">To Date</FormLabel>
              <Input
                type="date"
                name="toDate"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPageNumber(0);
                }}
                min={fromDate}
              />
            </FormControl>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
