import express, { response } from "express";
import cors from "cors";
import {
  getOrgansData,
  savesetting,
  getsetting,
  useSetting,
  getFileList,
} from "./controllers/fileData";
import * as midi from "./controllers/midi";

const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(3000, async () => {
  const serverAddress = await server.address();
  console.log("Aplikacja wystartowała", serverAddress);
});

app.post("/savesetting", async (params, response) => {
  if (params.body.data) {
    try {
      await savesetting(params.body.data);
      response.status(200).send({ success: true });
    } catch (err) {
      console.error(err);
      response.status(400).send({ success: false });
    }
  } else {
    response.status(400).send({ success: false });
  }
});

app.get("/getsetting", async (params, response) => {
  if (params.query.data) {
    try {
      const conf = await getsetting(params.query.data);
      if (conf === "Error") {
        response.status(400).send({ success: false });
      }
      response.status(200).send({ success: true, conf });
    } catch (err) {
      console.error(err);
      response.status(400).send({ success: false });
    }
  } else {
    response.status(400).send({ success: false });
  }
});

app.get("/usesetting", async (params, response) => {
  if (params.query.data) {
    try {
      const conf = await useSetting(params.query.data);
      if (conf === "Error") {
        response.status(400).send({ success: false });
      }
      response.status(200).send({ success: true, conf });
    } catch (err) {
      console.error(err);
      response.status(400).send({ success: false });
    }
  } else {
    response.status(400).send({ success: false });
  }
});

app.get("/getallsettingsfiles", async (URLSearchParams, response) => {
  try {
    const files = await getFileList();
    response.status(200).send({ success: true, files });
  } catch (err) {
    console.error(err);
    response.status(400).send({ success: false });
  }
});

app.get("/getData", async (params, response) => {
  try {
    const configuration = await getOrgansData();
    response.status(200).send({ success: true, configuration });
  } catch (error) {
    console.error(error);
    response.status(400).send({ success: false });
  }
});

app.get("/getinputs", async (params, response) => {
  try {
    const inputs = await midi.getsInputsList();
    response.status(200).send({ success: true, inputs });
  } catch (error) {
    console.error(error);
    response.status(400).send({ success: false });
  }
});

app.get("/getoutputs", async (params, response) => {
  try {
    const outputs = await midi.getsOutputsList();
    response.status(200).send({ success: true, outputs });
  } catch (error) {
    console.error(error);
    response.status(400).send({ success: false });
  }
});

app.get("/choseoutput", async (params, response) => {
  if (params.query.data) {
    try {
      await midi.choseMidi(params.query.data);
      response.status(200).send({ success: true });
    } catch (error) {
      console.error(error);
      response.status(400).send({ success: false });
    }
  } else {
    response.status(400).send({ success: false });
  }
});

app.get("/choseinput", async (params, response) => {
  if (params.query.data) {
    try {
      await midi.choseMidiinput(params.query.data);
      response.status(200).send({ success: true });
    } catch (error) {
      console.error(error);
      response.status(400).send({ success: false });
    }
  } else {
    response.status(400).send({ success: false });
  }
});

app.get("/midi", async (params, response) => {
  if (params.query.data) {
    try {
      const res = await midi.midi(params.query.data);
      if (res === true) {
        response.status(200).send({ success: true });
      } else {
        response.status(400).send({ success: false });
      }
    } catch (error) {
      console.error(error);
      response.status(400).send({ success: false });
    }
  } else {
    response.status(400).send({ success: false });
  }
});

app.post("/resetBug", async (params, response) => {
  if (params.body.data) {
    try {
      await midi.resetMidi(params.body.data);
      response.status(200).send({ success: true });
    } catch (err) {
      console.error(err);
      response.status(400).send({ success: false });
    }
  } else {
    response.status(400).send({ success: false });
  }
});
