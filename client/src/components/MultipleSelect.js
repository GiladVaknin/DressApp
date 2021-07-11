import React, { forwardRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, choosen, theme) {
  return {
    fontWeight:
      choosen.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MultipleSelect = forwardRef((props, ref) => {
  const classes = useStyles();
  const [choosen, setChoosen] = useState([]);

  const handleChange = (event) => {
    ref.current[props.selectName.toLowerCase() + "s"] = event.target.value;
    setChoosen(event.target.value);
  };

  function getColor(name) {
    if (name === "Multi")
      return {
        backgroundImage:
          "linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red)",
      };
    else if (name === "Neutral")
      return {
        backgroundColor: "#EBC8B2",
      };

    return {
      backgroundColor: name,
    };
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-checkbox-label">
          {props.selectName}
        </InputLabel>
        <Select
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          multiple
          value={choosen}
          onChange={handleChange}
          input={<Input />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {props.options.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={choosen.indexOf(name) > -1} />
              <ListItemText primary={name} />
              {props.selectName === "COLOR" ? (
                <div className="colorCircle" style={getColor(name)}></div>
              ) : null}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
});

export default MultipleSelect;
