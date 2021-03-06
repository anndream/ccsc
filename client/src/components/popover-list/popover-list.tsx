import { Checkbox, Popover } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { TooltipPlacement } from "antd/lib/tooltip";
import { Authorized } from "components/authorized";
import { SearchList, SearchListProps } from "components/search-list";
import React, { PropsWithChildren, useCallback, useState } from "react";
import { ConditionalWrapper } from "standalone/conditional-wrapper";
import {
  PopoverListCheckbox,
  PopoverListCheckboxBaseProps,
} from "./components/popover-list-checkbox";
import "./popover-list.css";

export interface CheckboxItem {
  value: string;
  label: string;
  status?: "success" | "processing" | "error" | "default" | "warning";
}

interface PopoverListProps<T extends CheckboxItem>
  extends PopoverListCheckboxBaseProps,
    SearchListProps<T> {
  action: React.ReactElement;
  title: string;
  placement?: TooltipPlacement;
  defaultValue: CheckboxValueType[];
  needsAuthorization?: boolean;
  elseElement?: React.ReactNode;
}

const PopoverList = <T extends CheckboxItem>({
  action,
  title,
  placement = "bottomRight",
  dataSource = [],
  searchFilters,
  defaultValue,
  searchPlaceholder,
  loading = false,
  onChange,
  needsAuthorization = false,
  elseElement,
}: PropsWithChildren<PopoverListProps<T>>): JSX.Element => {
  const [visible, setVisible] = useState(false);

  const renderItem = useCallback(
    ({ value, label, status }) => (
      <PopoverListCheckbox
        value={value}
        label={label}
        status={status}
        onChange={onChange}
      />
    ),
    [onChange]
  );

  return (
    <ConditionalWrapper
      condition={needsAuthorization}
      wrapper={(children) => (
        <Authorized elseElement={elseElement}>{children}</Authorized>
      )}
    >
      <Popover
        title={title}
        visible={visible}
        trigger="click"
        placement={placement}
        overlayClassName="popover-list"
        onVisibleChange={setVisible}
        content={
          <Checkbox.Group
            defaultValue={defaultValue}
            style={{ width: "100%", display: "block" }}
          >
            <SearchList<T>
              searchPlaceholder={searchPlaceholder}
              dataSource={dataSource}
              loading={loading}
              searchFilters={searchFilters}
              checkToFocus={visible}
              renderItem={renderItem}
            />
          </Checkbox.Group>
        }
      >
        {action}
      </Popover>
    </ConditionalWrapper>
  );
};

export default PopoverList;
