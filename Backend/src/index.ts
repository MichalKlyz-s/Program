import express from 'express'
import cors from 'cors';
import * as fs from 'fs';
import {hay} from './hello';
import * as midi from './controllers/midi'
import {WebMidi} from "webmidi";
// import test from "webmidi";
const app = express();
app.use(cors());

app.get('/midi', async (params, response) => {
    console.log('wejscie');
    // console.log(params.params);
    console.log(params.query.note);
    response.send({'success': true})
    // console.log(midi.midi('test', 'test'))
    midi.midi(params.query.note, "test")
    response.status(200).end();
});
//     WebMidi
//   .enable()
//   .then(() => console.log("WebMidi enabled!"))
//   .catch(err => alert(err));

//   WebMidi
//   .enable()
//   .then(onEnabled)
//   .catch(err => alert(err));

// function onEnabled() {
  
//   // Inputs
//   WebMidi.inputs.forEach(input => console.log("in" + input.manufacturer, input.name));
  
//   // Outputs
//   WebMidi.outputs.forEach(output => console.log(output.name));

// }
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

app.listen(8888, () => {
    console.log('Aplikacja wystartowała')
});
console.log(hay)