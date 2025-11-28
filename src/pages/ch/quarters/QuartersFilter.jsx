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

const QuartersFilter = ({
  quarterCode,
  setQuarterCode,
  setPageNumber,
  query,
}) => {
  const quarterType = query?.data?.data?.find(
    (row) => row?.code === quarterCode
  )?.quarterType;

  return (
    <Menu closeOnSelect={true}>
      <MenuButton
        as={Button}
        variant="outline"
        leftIcon={<MdOutlineFilterList size={20} />}
        w="fit-content"
      >
        Quarter Type: {quarterType || "All"}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="Filter by"
          type="radio"
          defaultValue={quarterCode}
          onChange={(value) => {
            setQuarterCode(value);
            setPageNumber(0);
          }}
        >
          <MenuItemOption value="">All</MenuItemOption>
          {query?.data?.data?.map((row) => (
            <MenuItemOption key={row?.code} value={`${row?.code}`}>
              {row?.quarterType}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default QuartersFilter;
