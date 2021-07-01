import React, { forwardRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const SingleSelect = forwardRef((props, ref) => {
  const classes = useStyles();
  const [option, setOption] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const emptyFunction = function () {
    return;
  };
  let renderParent = null;
  if (props.renderParent) {
    renderParent = props.renderParent;
  }

  const handleChange = (event) => {
    ref.current[props.selectName.toLowerCase()] = event.target.value;
    setOption(event.target.value);
    renderParent ? renderParent() : emptyFunction();
    if (renderParent) {
      renderParent();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">
          {props.selectName}
        </InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={option}
          onChange={handleChange}
        >
          {props.options.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
          {/* <MenuItem value={"men"}>Men</MenuItem> */}
          {/* <MenuItem value={"women"}>Women</MenuItem> */}
        </Select>
      </FormControl>
    </div>
  );
});

export default SingleSelect;
