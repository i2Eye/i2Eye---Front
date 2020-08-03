import getTestData from "../../TestData";
import exportCSV from "./ExportCSV";
import autoTable from "jspdf-autotable";

global.window = {};

self.addEventListener("message", function (event) {
  switch (event.data) {
    case "save excel": {
      const csvData = [];
      for (let i = 1; i <= 10000; i++) {
        csvData[i - 1] = getTestData(i);
      }
      self.postMessage(exportCSV(csvData));
      self.close();
      break;
    }

    case "save pdf": {
      const jsPDF = require("jspdf/dist/jspdf.node.min");
      var doc = new jsPDF({ orientation: "l", unit: "cm", format: "a4" });
      doc.text("test", 1, 1);
      const header = [
        "ID",
        ...getTestData(1)
          .registration.map(
            (question) => question.num + ". " + question.question
          )
          .slice(0, 5),
      ];
      const people = [];
      for (let i = 1; i <= 10000; i++) {
        people[i - 1] = [
          i,
          ...getTestData(i)
            .registration.map((question) => question.answer)
            .slice(0, 5),
        ];
      }
      const table = { head: [header], body: people };

      autoTable(doc, table);
      var pdfBlob = doc.output("blob");
      self.postMessage(pdfBlob);
      self.close();
      break;
    }
    default: {
      console.log("error");
      break;
    }
  }
});
