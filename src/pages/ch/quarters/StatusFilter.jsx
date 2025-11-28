import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { MdOutlineFilterList } from "react-icons/md";

const StatusFilter = ({ status, setStatus, setPageNumber }) => {
  const statusList = [
    { label: "All", value: "all" },
    { label: "Vacant", value: "vacant" },
    { label: "Occupied", value: "occupied" },
    { label: "Allotted (not yet occupied)", value: "allotted" },
    { label: "Reserved (not yet occupied)", value: "reserved" },
    { label: "Major Repair", value: "major repair" },
    { label: "Unusable", value: "unusable" },
  ];

  return (
    <Menu closeOnSelect={true}>
      <MenuButton
        as={Button}
        variant="outline"
        leftIcon={<MdOutlineFilterList size={20} />}
        w="fit-content"
      >
        Status: {statusList.find((row) => row.value === status)?.label}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="Filter by"
          type="radio"
          defaultValue={status}
          onChange={(value) => {
            setStatus(value);
            setPageNumber(0);
          }}
        >
          {statusList.map((row) => (
            <MenuItemOption key={row?.value} value={`${row?.value}`}>
              {row?.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default StatusFilter;
