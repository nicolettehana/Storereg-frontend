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
  includeAll,
}) => {
  // Default selection logic
  useEffect(() => {
    // If "All" is allowed, default to All
    if (includeAll === 1 && yearRangeId === undefined) {
      setYearRangeId("");
      return;
    }

    // Otherwise default to first item
    if (
      includeAll !== '1' &&
      !yearRangeId &&
      query?.data?.data?.length > 0
    ) {
      setYearRangeId(String(query.data.data[0].id));
    }
  }, [query?.data?.data, yearRangeId, setYearRangeId, includeAll]);

  const selectedRange = query?.data?.data?.find(
    (row) => String(row?.id) === yearRangeId
  );

  const buttonLabel =
    yearRangeId === ""
      ? "All"
      : selectedRange
      ? `${selectedRange.startYear} - ${selectedRange.endYear}`
      : "";

  return (
    <Menu closeOnSelect>
      <MenuButton
        as={Button}
        variant="outline"
        leftIcon={<MdOutlineFilterList size={20} />}
        w="fit-content"
      >
        Year Range: {buttonLabel}
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
          {includeAll === '1' && (
            <MenuItemOption value="">
              All
            </MenuItemOption>
          )}

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