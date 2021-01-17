import React, { memo, useMemo } from 'react';
import { Field, useFormikContext } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import MuiSelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import makeStyles from '@material-ui/core/styles/makeStyles';

const createClasses = makeStyles((theme) => ({
  input: {
    backgroundColor: theme.palette.background.default
  }
}));

interface SelectOption {
  name: string;
  value: string;
}

interface SelectProps<Name = string, U = SelectOption> {
  data: {
    label: string;
    name: Name;
    options: U[];
  };
}

const Select = <T extends Record<keyof T, unknown>>(props: SelectProps) => {
  const { data } = props;
  const classes = createClasses();
  const { label, name, options } = data;

  const { handleChange, errors, touched } = useFormikContext<T>();
  // eslint-disable-next-line
  // @ts-ignore
  const error = useMemo(() => touched[name] && errors[name], [
    errors,
    name,
    touched
  ]);
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel>
        <Typography>{label}</Typography>
      </InputLabel>
      <Field
        name={name}
        label={label}
        as={MuiSelect}
        onChange={handleChange}
        error={error}
        MenuProps={{
          disablePortal: true
        }}
        inputProps={{
          className: classes.input
        }}
      >
        {options.map((option) => {
          const { value, name: optionName } = option;
          return (
            <MenuItem key={value} value={value}>
              <Typography>{optionName}</Typography>
            </MenuItem>
          );
        })}
      </Field>
      <FormHelperText error={!!error}>{error}</FormHelperText>
    </FormControl>
  );
};

export default memo(Select) as typeof Select;
