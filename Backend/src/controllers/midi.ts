import {WebMidi} from "webmidi";
let output: string =  "Microsoft GS Wavetable Synth";
let isUpdayed = false;
let input: string = "";
//  Dodanie program change do kopli
// sendNodeOn/off (zmiana na 2 metody)
// Granie paru nut w ty samym czasi, granie na rózżnych kanałach naraz   || dodać granie na stringu i na arrayce stringówe (zmiana lekka metody)
export const choseMidi = (params: any) =>{
  try {
    output = params.value;
    isUpdayed = true;
  } catch (error) {
    console.error(error)
    return 'Error';
  }
}
export const choseMidiinput = (params: any) =>{
  try {
    input = params.value;
  } catch (error) {
    console.error(error)
    return 'Error';
  }
}
export const getsInputsList = async() =>{
try {
  let inputs: string[] = [];
  await WebMidi
  .enable()
  .then(onEnabled)
  .catch(err => console.log(err));
  function onEnabled() {
    WebMidi.inputs.forEach(input => inputs.push(input.name));
  } 
  return inputs;
  } catch (error) {
    console.error(error)
    return 'Error';
  }
}
export const getsOutputsList = async() =>{
try {
  let outputs: string[] = [];
  await WebMidi
  .enable()
  .then(onEnabled)
  .catch(err => console.log(err));
   function onEnabled() {
    WebMidi.outputs.forEach(output => outputs.push(output.name));
  } 
  return outputs;
  } catch (error) {
    console.error(error)
    return 'Error';
  }
}

export const midi = (params: any) =>{
    const note = params.note;
    const noteOnOff = params.noteOnOff;
    const channelNumber = params.channel;
    const playMethod = params.playMethod;
    if(!note || !noteOnOff || !channelNumber || !playMethod){
      return  {'succes': false}
    }
    WebMidi
    .enable()
    .then(sendMidi)
    .catch(err => console.log(err));
    async function sendMidi(){
      const myOutput = await WebMidi.getOutputByName(output);
      // let channel = myOutput.channels[channelNumber];
      if(playMethod === "MiDi"){
        // todo
        // Do sprawdzenia czy kople, głosy oraz dodatki działają tak samo na play node onof albo send czy tylko program change itp
        if(noteOnOff === 'pressed'){
          myOutput.sendNoteOn(note, {channels: channelNumber});
        }else{
          myOutput.sendNoteOff(note, {channels: channelNumber});
        }
      }
      else if(playMethod === 'ProgramChange'){
        myOutput.sendProgramChange(note, {channels: channelNumber})
      }
      else{
        myOutput.sendAllSoundOff();
      }
      // channel.playNote(note);/// is it a use or not??
      // channel.stopNote(note);////
    // .sendAllNotesOff(...) -> wycisza wszytsko
      // channel.playNote(note, {duration: 1000});  //granioe chanel play

    }
    return  {'succes': true };
}

export const listenToMidi = (params: any) => {
  // Do testu na spotkanmiu czy da się coś z tego wyciągnać czy nie
  // console.log(params)
  WebMidi
  .enable()
  .then(test)
  .catch(err => console.log(err));
  function test(){
    let myInput = WebMidi.getInputByName(params.value);
    let listen = myInput?.addOneTimeListener("noteon", test2);
    console.log(listen)

  }
  function test2(){
  }
}
        // todo

  // channel.stopNote(note);
  // myOutput.sendNoteOn(note, {channels: channelNumber});
  // myOutput.sendNoteOff(note, {channels: channelNumber});
  // myOutput.sendProgramChange(note, {channels: channelNumber})
// .sendAllNotesOff(...) -> wycisza wszytsko

  // channel.playNote(note);
  // this or this
  // myOutput.sendNoteOn(note, {channels: channelNumber});
  // } else {
  // myOutput.sendProgramChange(note, {channels: channelNumber})
  // }
  // myOutput.sendSysex()  Do ogarnięcia

// outputs:
        // todo

// .octaveOffset
// .playNote(...)  -> no stop without duration
// .stopNote(...)
// .sendAllNotesOff(...) -> wycisza wszytsko
// .sendNoteOff(...)
// .sendNoteOn(...)  --> idk
// .sendProgramChange(...)
// WebMidi.enable({sysex: true})
//   .then(() => console.log("System exclusive messages are enabled");
//   .sendSysex(...)

// .sendReset(...)???.sendResetAllControllers(...) .sendStart(...) .sendStop(...)

// .sendNrpnValue(...)
// Sets a non-registered parameter (NRPN) to the specified value. The NRPN is selected by passing in a two-position array specifying the values of the two control bytes. The value is specified by passing in a single integer (most cases) or an array of two integers.

// NRPNs are not standardized in any way. Each manufacturer is free to implement them any way they see fit. For example, according to the Roland GS specification, you can control the vibrato rate using NRPN (1, 8). Therefore, to set the vibrato rate value to 123 you would use:

// WebMidi.outputs[0].channels[0].sendNrpnValue([1, 8], 123);

// In some rarer cases, you need to send two values with your NRPN messages. In such cases, you would use a 2-position array. For example, for its ClockBPM parameter (2, 63), Novation uses a 14-bit value that combines an MSB and an LSB (7-bit values). So, for example, if the value to send was 10, you could use:

// WebMidi.outputs[0].channels[0].sendNrpnValue([2, 63], [0, 10]);

// For further implementation details, refer to the manufacturer's documentation.

        // todo

// [options.attack]	number
// 0.5	The velocity at which to play the note (between 0 and 1). If the rawAttack option is also defined, it will have priority. An invalid velocity value will silently trigger the default of 0.5.
// [options.rawAttack]	number
// 64	The attack velocity at which to play the note (between 0 and 127). This has priority over the attack property. An invalid velocity value will silently trigger the default of 64.
// [options.release]	number
// 0.5	The velocity at which to release the note (between 0 and 1). If the rawRelease option is also defined, it will have priority. An invalid velocity value will silently trigger the default of 0.5. This is only used with the note off event triggered when options.duration is set.
// [options.rawRelease]	number
// 64	The velocity at which to release the note (between 0 and 127). This has priority over the release property. An invalid velocity value will silently trigger the default of 64. This is only used with the note off event triggered when options.duration is set.

// .sendOmniMode(...)
// Since: 3.0.0

// Sets OMNI mode to on or off for the specified channel(s). MIDI's OMNI mode causes the instrument to respond to messages from all channels.

// It should be noted that support for OMNI mode is not as common as it used to be.