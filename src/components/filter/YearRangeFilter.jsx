import React from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { MdOutlineFilterList } from "react-icons/md";

const YearRangeFilter = ({
  yearRangeId,
  setYearRangeId,
  setPageNumber,
  query,
}) => {
  const selectedRange = query?.data?.data?.find(
    //(row) => row?.id === yearRangeId
    (row) => String(row?.id) === yearRangeId
  );

  return (
    <Menu closeOnSelect={true}>
      <MenuButton
        as={Button}
        variant="outline"
        leftIcon={<MdOutlineFilterList size={20} />}
        w="fit-content"
      >
        Year Range:{" "}
        {selectedRange
          ? `${selectedRange.startYear} - ${selectedRange.endYear}`
          : "All"}
      </MenuButton>

      <MenuList>
        <MenuOptionGroup
          title="Filter by Year Range"
          type="radio"
          //defaultValue={yearRangeId}
          value={yearRangeId ?? ""}
          onChange={(value) => {
            setYearRangeId(value); // keep as STRING
            setPageNumber(0);
          }}

          // onChange={(value) => {
          //   setYearRangeId(value);
          //   setPageNumber(0);
          // }}
        >
          <MenuItemOption value="">All</MenuItemOption>

          {query?.data?.data?.map((row) => (
            <MenuItemOption key={row.id} value={String(row.id)}>
              {row.startYear} - {row.endYear}
            </MenuItemOption>
          ))}
          {/* {query?.data?.data?.map((row) => (
            <MenuItemOption key={row.id} value={row.id}>
              {row.startYear} - {row.endYear}
            </MenuItemOption>
          ))} */}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default YearRangeFilter;
