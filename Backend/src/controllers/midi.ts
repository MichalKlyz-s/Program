import { WebMidi } from "webmidi";
let output: string = "Microsoft GS Wavetable Synth";
let isUpdayed = false;
let input: string = "";

export const choseMidi = (params: any) => {
  try {
    output = params;
    isUpdayed = true;
  } catch (error) {
    console.error(error);
    return "Error";
  }
};
export const choseMidiinput = (params: any) => {
  try {
    input = params.value;
  } catch (error) {
    console.error(error);
    return "Error";
  }
};
export const getsInputsList = async () => {
  try {
    let inputs: string[] = [];
    await WebMidi.enable()
      .then(onEnabled)
      .catch((err) => console.log(err));
    function onEnabled() {
      WebMidi.inputs.forEach((input) => inputs.push(input.name));
    }
    return inputs;
  } catch (error) {
    console.error(error);
    return "Error";
  }
};
export const getsOutputsList = async () => {
  try {
    let outputs: string[] = [];
    await WebMidi.enable()
      .then(onEnabled)
      .catch((err) => console.log(err));
    function onEnabled() {
      WebMidi.outputs.forEach((output) => outputs.push(output.name));
    }
    return outputs;
  } catch (error) {
    console.error(error);
    return "Error";
  }
};
export const midi = (params: any) => {
  let note = params.note;
  const noteOnOff = params.noteOnOff;
  const channelNumber = params.channel;
  const playMethod = params.playMethod;
  const chosenOutput = params.chosenOutput;
  if (!note || !noteOnOff || !channelNumber || !playMethod || !chosenOutput) {
    return { succes: false };
  }
  try {
    if (chosenOutput !== output) {
      choseMidi(chosenOutput);
    }
    WebMidi.enable()
      .then(() => console.log(""))
      .catch((err) => console.log(err));
    WebMidi.enable()
      .then(sendMidi)
      .catch((err) => console.log(err));
    async function sendMidi() {
      const myOutput = WebMidi.getOutputByName(output);
      // let channel = myOutput.channels[channelNumber];
      if (playMethod === "MiDi") {
        // todo
        // Do sprawdzenia czy kople, głosy oraz dodatki działają tak samo na play node onof albo send czy tylko program change itp
        if (noteOnOff === "pressed") {
          myOutput.sendNoteOn(note, { channels: channelNumber });
        } else {
          myOutput.sendNoteOff(note, { channels: channelNumber });
        }
      } else if (playMethod === "ProgramChange") {
        if (noteOnOff === "pressed") {
          const nodeToPlay = 2 * note;
          myOutput.sendProgramChange(nodeToPlay, { channels: channelNumber });
        } else {
          const nodeToPlay = 2 * note + 1;
          myOutput.sendProgramChange(nodeToPlay, { channels: channelNumber });
        }
      } else {
        myOutput.sendAllSoundOff();
      }
    }
    return { succes: true };
  } catch (error) {
    console.error(error);
    return "Error";
  }
};
