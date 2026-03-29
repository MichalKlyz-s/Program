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
export const midi = async (params: any) => {
  let note = params.note;
  const noteOnOff = params.noteOnOff;
  const channelNumber = params.channel;
  const playMethod = params.playMethod;
  const chosenOutput = params.chosenOutput;
  if (!note || !noteOnOff || !channelNumber || !playMethod || !chosenOutput) {
    return false;
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
      const playTime = WebMidi.time + 5;
      if (playMethod === "MiDi") {
        if (noteOnOff === "pressed") {
          for (let i = 0; i < note.length; i++) {
            myOutput.sendNoteOn(note[i], {
              channels: channelNumber[i],
              time: playTime,
            });
          }
        } else {
          for (let i = 0; i < note.length; i++) {
            myOutput.sendNoteOff(note[i], {
              channels: channelNumber[i],
              time: playTime,
            });
          }
        }
      } else if (playMethod === "ProgramChange") {
        if (noteOnOff === "pressed") {
          for (let i = 0; i < note.length; i++) {
            const noteToPlay = 2 * note[i];
            myOutput.sendProgramChange(noteToPlay, {
              channels: channelNumber[i],
            });
          }
        } else if (noteOnOff === "released") {
          for (let i = 0; i < note.length; i++) {
            const noteToPlay = 2 * note[i] + 1;
            myOutput.sendProgramChange(noteToPlay, {
              channels: channelNumber[i],
            });
          }
        } else {
          myOutput.sendProgramChange(note, {
            channels: channelNumber,
          });
        }
      } else {
        myOutput.sendAllSoundOff();
      }
    }
    return true;
  } catch (error) {
    console.error(error);
    return "Error";
  }
};

export const resetMidi = async (params: any) => {
  const chosenOutput = params;
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
      myOutput.sendReset();
      myOutput.sendResetAllControllers();
      myOutput.sendAllSoundOff();
      myOutput.sendAllNotesOff();
    }
  } catch (error) {
    console.error(error);
    return "Error";
  }
};
