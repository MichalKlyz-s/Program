import express, { response } from 'express'
import cors from 'cors';
import {getOrgansData} from "./controllers/fileData"

import * as fs from 'fs';
import * as midi from './controllers/midi'
import {WebMidi} from "webmidi";
// import test from "webmidi";
const app = express();
app.use(cors());


const server = app.listen(8888, () => {
  const serverAddress = server.address();
  console.log('Aplikacja wystartowała', serverAddress)
});

app.get('/getData', async (params, response) => {
  try {
    const configuration = getOrgansData();
    response.send({'success': true, configuration})
  } catch (error) {
    console.error(error);
  }
});

app.get('/midi', async (params, response) => {
    console.log('wejscie');
    response.send({'success': true})
    midi.midi(params.query.data, "test")
    response.status(200).end();
});

app.get('/choseOutput', async (params, response) => {
    console.log(params.query.data)
    midi.choseMidi(params.query.data, "test")
    response.send({'success': true})
    response.status(200).end();
})

app.get('/connect', async (params, response) => {

  WebMidi
  .enable()
  .then(onEnabled)
  .catch(err => alert(err));

function onEnabled() {
let outputs: string[] = [];
  // Inputs
  WebMidi.inputs.forEach(input => console.log("in" + input.manufacturer, input.name));

  // Outputs
  WebMidi.outputs.forEach(output => outputs.push(output.name));

  let resp = {'success': true, outputs,  'chosenData': getOrgansData()}
  response.send(
    resp);
}
});

app.get('/midi_voices_change', async (params, response) => {
  console.log('hey');
  console.log(params.query);
  midi.midiChangeVoice(params.query.data, "test")
  response.status(200).end();
});




// WebMidi
// .enable()
// .then(test)
// .catch(err => alert(err));
// function test(){
//   let myOutput = WebMidi.getOutputByName("Microsoft GS Wavetable Synth");
//   console.log("Moje"+ myOutput.name);
//   let channel = myOutput.channels[1];
//   channel.playNote("C3", {duration: 1000});
// }
// myOutput.sendAllSoundOff();


// })


