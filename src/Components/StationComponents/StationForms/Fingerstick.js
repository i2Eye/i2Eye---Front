import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import getTestData from "../../../TestData";
import "../../../dbFunctions";
import { updatePatientData } from "../../../dbFunctions";

const radioQuestions = [
  {
    num: 1,
    question: "Is patient > 18 years old?",
    helper: "If Yes, proceed. If No, skip RCBG station.",
  },
];

const questions = [
  {
    num: 2,
    question: "Random capillary blood glucose (mg/dL)",
    label: "RCBG (mg/dL)",
    id: "RCBG",
  },
];

const handleEdit = (id) => {
  const data = getTestData(id).fingerstickRCBG;
  const newState = {
    age:
      data[0].answer === "Y"
        ? "Above 18"
        : data[0].answer === "N"
        ? "18 and below"
        : "",
    RCBG: data[1].answer,
  };
  return newState;
};

class EyeScreening extends Component {
  state = handleEdit(this.props.id);

  handleSubmit() {
    //get final data of form
    if(!this.state.age) {
      alert("Required fields cannot be left empty!");
    } else if (this.state.age == "Above 18" && !this.state.RCBG) {
      alert("Required fields cannot be left empty!");
    } else {
    console.log(this.state);
    const answers = {
      "Fingerstick Blood Test (RCBG)": [
        {
          answers: this.state.age,
          num: 1,
          question: "Is patient > 18 years old?",
        },
        {
          answers: this.state.RCBG,
          num: 2,
          question: "Random capillary blood glucose (mg/dL)",
        },
      ],
    };

    updatePatientData(this.props.id, answers).then((response) =>
      console.log(response)
    );
  }
}

  handleAgeChange(e) {
    this.setState({ age: e.target.value });
  }

  handleChange(e) {
    this.setState({ RCBG: e.target.value });
  }

  render() {
    const data = getTestData(this.props.patientID);
    const prevData = data.fingerstickRCBG;

    return (
      <div>
        <h1 style={{ fontFamily: "sans-serif", fontSize: 30 }}>
          Fingerstick Blood Test (RCBG)
        </h1>
        <form>
          <ol>
            {radioQuestions.map((question) => (
              <div key={question.question}>
                <li
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 22,
                    fontWeight: "normal",
                  }}
                >
                  <FormControl component="fieldset">
                    <FormLabel
                      component="legend"
                      style={{ fontSize: 22, color: "black" }}
                    >
                      {question.question}
                    </FormLabel>
                    <RadioGroup
                      aria-label="age"
                      name="age"
                      onChange={this.handleAgeChange.bind(this)}
                      value={this.state.age}
                    >
                      <FormControlLabel
                        value="Above 18"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="18 and below"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                    <FormHelperText style={{ color: "red", fontSize: 15 }}>
                      {question.helper}
                    </FormHelperText>
                  </FormControl>
                  <p />
                </li>
              </div>
            ))}
            {questions.map((question) => (
              <div key={question.question}>
                <span>
                  <li
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: 22,
                      fontWeight: "normal",
                    }}
                  >
                    <InputLabel style={{ fontSize: 22, color: "black" }}>
                      {question.question}
                    </InputLabel>
                    <TextField
                      disabled={
                        this.state.age === "18 and below" ? true : false
                      }
                      key={question.question}
                      onChange={this.handleChange.bind(this)}
                      type="number"
                      label={question.label}
                      defaultValue={this.state.RCBG}
                    />
                    <p />
                  </li>
                </span>
              </div>
            ))}
            <Button
              size="large"
              color="primary"
              variant="contained"
              onClick={this.handleSubmit.bind(this)}
            >
              Submit
            </Button>
          </ol>
        </form>
      </div>
    );
  }
}

export default EyeScreening;
