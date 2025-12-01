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

const CategoriesFilter = ({
  categoryCode,
  setCategoryCode,
  setPageNumber,
  query,
}) => {
  const categoryType = query?.data?.data?.find(
    (row) => row?.code === categoryCode
  )?.name;

  return (
    <Menu closeOnSelect={true}>
      <MenuButton
        as={Button}
        variant="outline"
        leftIcon={<MdOutlineFilterList size={20} />}
        w="fit-content"
      >
        Item Category: {categoryType || "All"}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="Filter by"
          type="radio"
          defaultValue={categoryCode}
          onChange={(value) => {
            setCategoryCode(value);
            setPageNumber(0);
          }}
        >
          <MenuItemOption value="">All</MenuItemOption>
          {query?.data?.data?.map((row) => (
            <MenuItemOption key={row?.code} value={`${row?.code}`}>
              {row?.name}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default CategoriesFilter;
