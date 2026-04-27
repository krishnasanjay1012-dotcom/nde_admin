import CommonTextField from "./NDE-TextField";
import CommonSelect from "./NDE-Select";
import CommonMultiSelect from "./NDE-MultiSelect";
import CommonNumberField from "./NDE-NumberField";
import CommonDescriptionField from "./NDE-DescriptionField";
import CommonCheckbox from "./NDE-Checkbox";
import CommonRadioButton from "./NDE-RadioButton";
import CommonDatePicker from "./NDE-DatePicker";
import CommonToggleSwitch from "../NDE-CommonToggleSwitch";

const CommonDynamicField = ({ fieldType, ...props }) => {
  const type = fieldType?.toLowerCase()?.trim() || "text";

  switch (type) {
    case "text":
    case "email":
    case "url":
    case "password":
    case "tel":
      return <CommonTextField type={type} {...props} />;

    case "number":
    case "integer":
    case "decimal":
    case "float":
      return <CommonNumberField {...props} />;

    case "select":
    case "dropdown":
      return <CommonSelect {...props} />;

    case "multiselect":
      return <CommonMultiSelect {...props} />;

    case "textarea":
    case "description":
    case "longtext":
      return <CommonDescriptionField {...props} />;

    case "checkbox":
    case "boolean":
      return <CommonCheckbox {...props} />;

    case "switch":
    case "toggle":
      return <CommonToggleSwitch {...props} />;

    case "radio":
      return <CommonRadioButton {...props} />;

    case "date":
    case "datetime":
      return <CommonDatePicker {...props} />;

    default:
      return <CommonTextField {...props} />;
  }
};

export default CommonDynamicField;
