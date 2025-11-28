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

const WaitingListFilter = ({
  waitingListQuery,
  waitingListCode,
  setWaitingListCode,
}) => {
  const waitingList = waitingListQuery?.data?.data?.find(
    (row) => row?.code === parseInt(waitingListCode)
  );

  return (
    <Menu closeOnSelect={true}>
      <MenuButton
        as={Button}
        variant="outline"
        leftIcon={<MdOutlineFilterList size={20} />}
        w="fit-content"
      >
        Showing: {waitingList?.list}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="Filter by"
          type="radio"
          value={`${waitingListCode}`}
          onChange={(value) => {
            setWaitingListCode(value);
          }}
        >
          {waitingListQuery?.data?.data?.map((row) => (
            <MenuItemOption key={row?.code} value={`${row?.code}`}>
              {row?.list}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default WaitingListFilter;
