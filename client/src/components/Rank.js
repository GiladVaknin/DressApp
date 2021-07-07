import React from "react";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
}));

export default function Rank({ rank }) {
  const classes = useStyles();

  return (
    <span className={classes.root}>
      <Rating
        name="half-rating-read"
        defaultValue={rank}
        precision={0.2}
        readOnly
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
      />
    </span>
  );
}
