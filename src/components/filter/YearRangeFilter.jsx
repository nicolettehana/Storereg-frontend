import React, { useEffect } from "react";
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
  // Set default to first item when data loads
  useEffect(() => {
    if (!yearRangeId && query?.data?.data?.length > 0) {
      setYearRangeId(String(query.data.data[0].id));
    }
  }, [query?.data?.data, yearRangeId, setYearRangeId]);

  const selectedRange = query?.data?.data?.find(
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
          : ""}
      </MenuButton>

      <MenuList>
        <MenuOptionGroup
          title="Filter by Year Range"
          type="radio"
          value={yearRangeId}
          onChange={(value) => {
            setYearRangeId(value);
            setPageNumber(0);
          }}
        >
          {query?.data?.data?.map((row) => (
            <MenuItemOption key={row.id} value={String(row.id)}>
              {row.startYear} - {row.endYear}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default YearRangeFilter;
