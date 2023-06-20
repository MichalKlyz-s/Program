import {WebMidi} from "webmidi";
import {chosenData} from "./midiData"
let output = "Microsoft GS Wavetable Synth";

export const choseMidi = (params: any, req: any) =>{
console.log(params);
output = params;
}
export const midi = (params: any, req: any) =>{
    console.log(params);
    const note = params.note;
    const channelNumber = params.channel;
    WebMidi
    .enable()
    .then(() => console.log("WebMidi enabled!"))
    .catch(err => alert(err));

    // WebMidi
    // .enable()
    // .then(onEnabled)
    // .catch(err => alert(err));

//   function onEnabled() {

//     // Inputs
//     WebMidi.inputs.forEach(input => console.log("in" + input.manufacturer, input.name));

//     // Outputs
//     WebMidi.outputs.forEach(output => console.log(output.name));

//   }
  WebMidi
  .enable()
  .then(test)
  .catch(err => alert(err));
  function test(){
    let myOutput = WebMidi.getOutputByName(output);
    console.log("Moje"+ myOutput.name);
    let channel = myOutput.channels[channelNumber];
    channel.playNote(note, {duration: 1000});
  }
    const answer = {
        'succes': true,
        'user': 'mk'
    }
    return  {'succes': true,
    'user': 'mk',
    // 'chosenData': chosenData
  };
}