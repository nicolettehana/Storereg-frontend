import React from "react";
import { Field } from "formik";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import ReactSelect from "react-select";

const SelectFieldSearchable = ({
  name,
  label,
  isRequired = true,
  placeholder,
  disabled = false,
  options = [],
}) => (
  <Field name={name}>
    {({ field, form, meta }) => {
      const selectedOption =
        options.find((o) => o.value === field.value) || null;

      return (
        <FormControl
          isInvalid={meta.touched && meta.error}
          isRequired={isRequired}
        >
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <ReactSelect
            id={name}
            options={options}
            value={selectedOption}
            placeholder={placeholder}
            isDisabled={disabled}
            isClearable
            isSearchable
            onChange={(option) =>
              form.setFieldValue(name, option ? option.value : "")
            }
            onBlur={() => form.setFieldTouched(name, true)}
          />
          <FormErrorMessage>{meta.error}</FormErrorMessage>
        </FormControl>
      );
    }}
  </Field>
);

export default SelectFieldSearchable;
