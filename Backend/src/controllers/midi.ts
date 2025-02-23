import {WebMidi} from "webmidi";
import {chosenData} from "./midiData"
let output: string =  "Microsoft GS Wavetable Synth";
let isUpdayed = false;
//  Dodanie program change do kopli
// sendNodeOn/off (zmiana na 2 metody)
// Granie paru nut w ty samym czasi, granie na rózżnych kanałach naraz   || dodać granie na stringu i na arrayce stringówe (zmiana lekka metody)
export const choseMidi = (params: any, req: any) =>{
console.log(params);
output = params;
isUpdayed = true;
}
export const midi = (params: any, req: any) =>{
    console.log(params);
    const note = params.note;
    const noteOnOff = params.noteOnOff;
    const channelNumber = params.channel;
    WebMidi
    .enable()
    .then(() => console.log("WebMidi enabled!"))
    .catch(err => alert(err));

  //   WebMidi
  //   .enable()
  //   .then(onEnabled)
  //   .catch(err => alert(err));

  // function onEnabled() {

  //   // Inputs
  //   WebMidi.inputs.forEach(input => console.log("in" + input.manufacturer, input.name));

  //   // Outputs
  //   WebMidi.outputs.forEach(outputList => console.log(outputList.name));

  // }

  // Zmiana na send node On/off (po wciśnieciu i puszczeniu klawisza)
  WebMidi
  .enable()
  .then(test)
  .catch(err => alert(err));
  function test(){
    let myOutput = WebMidi.getOutputByName(output);
    console.log("Moje"+ myOutput.name);
    let channel = myOutput.channels[channelNumber];
    if(noteOnOff == 'pressed'){
      myOutput.sendNoteOn(note, {channels: channelNumber});
    }else{
      myOutput.sendNoteOff(note, {channels: channelNumber});
    }
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