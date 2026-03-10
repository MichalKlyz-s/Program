// import { WebMidi } from "webmidi";
import easymidi from "easymidi";
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
    easymidi.getInputs().forEach((input) => inputs.push(input));
    return inputs;
  } catch (error) {
    console.error(error);
    return "Error";
  }
};
export const getsOutputsList = async () => {
  try {
    let outputs: string[] = [];
    easymidi.getOutputs().forEach((output) => outputs.push(output));
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
    return { succes: false };
  }
  if (chosenOutput !== output) {
    choseMidi(chosenOutput);
  }
  const myOutput = new easymidi.Output(output);
  try {
    if (playMethod === "MiDi") {
      if (noteOnOff === "pressed") {
        for (let i = 0; i < note.length; i++) {
          myOutput.send("noteon", {
            note: Number(note[i]),
            velocity: 127,
            channel: channelNumber[i],
          });
        }
      } else {
        for (let i = 0; i < note.length; i++) {
          myOutput.send("noteon", {
            note: Number(note[i]),
            velocity: 0,
            channel: channelNumber[i],
          });
        }
      }
    } else if (playMethod === "ProgramChange") {
      if (noteOnOff === "pressed") {
        for (let i = 0; i < note.length; i++) {
          const nodeToPlay = 2 * note[i];
          myOutput.send("program", {
            number: Number(nodeToPlay),
            channel: Number(channelNumber[i]),
          });
        }
      } else if (noteOnOff === "released") {
        for (let i = 0; i < note.length; i++) {
          const nodeToPlay = 2 * note[i] + 1;
          myOutput.send("program", {
            number: Number(nodeToPlay),
            channel: Number(channelNumber[i]),
          });
        }
        // Przetestować dlaczego time nie chce działać
      } else {
        myOutput.send("program", {
          number: Number(note),
          channel: Number(channelNumber[0]),
        });
      }
    }
    return { succes: true };
  } catch (error) {
    console.error(error);
    return "Error";
  } finally {
    myOutput.close();
  }
};

export const resetMidi = async (params: any) => {
  const chosenOutput = params;
  const myOutput = new easymidi.Output(output);
  try {
    if (chosenOutput !== output) {
      choseMidi(chosenOutput);
    }
    const myOutput = new easymidi.Output(output);
    // myOutput.send('sysex', [0xF0, 0x7E, 0x7F, 0x09, 0x01, 0xF7] );
    myOutput.send("reset");
    // myOutput.sendReset();
    // myOutput.sendResetAllControllers();
    // myOutput.sendAllSoundOff();
    // myOutput.sendAllNotesOff();
  } catch (error) {
    console.error(error);
    return "Error";
  } finally {
    myOutput.close();
  }
};
