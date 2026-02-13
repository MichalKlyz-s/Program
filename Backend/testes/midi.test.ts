import { WebMidi } from "webmidi";
import * as midiTest from "../src/controllers/midi";

jest.mock("webmidi", () => ({
  WebMidi: {
    enable: jest.fn(),
    getOutputByName: jest.fn(),
    outputs: [
      { name: "Microsoft GS Wavetable Synth" },
      { name: "Linux GS Wavetable Synth" },
    ],
  },
}));

describe("choseMidi", () => {
  it("Zmiana użądzenia Midi", () => {
    const device = "Microsoft GS Wavetable Synth";
    expect(() => midiTest.choseMidi(device)).not.toThrow();
  });
});
describe("getsOutputsList", () => {
  it("Pozyskaj listę Midi", async () => {
    (WebMidi.enable as jest.Mock).mockResolvedValue(undefined);
    const res = await midiTest.getsOutputsList();
    expect(res).toEqual([
      "Microsoft GS Wavetable Synth",
      "Linux GS Wavetable Synth",
    ]);
    expect(WebMidi.enable).toHaveBeenCalled();
  });
});
describe("midiSendNoteON", () => {
  it("Wyślij sygnał do Midi sendNoteOn", async () => {
    const mockSendNoteOn = jest.fn();
    const params = {
      note: 4,
      noteOnOff: "pressed",
      channel: 1,
      playMethod: "MiDi",
      chosenOutput: "Microsoft GS Wavetable Synth",
    };
    (WebMidi.getOutputByName as jest.Mock).mockReturnValue({
      sendNoteOn: mockSendNoteOn,
    });
    const res = await midiTest.midi(params);

    expect(WebMidi.enable).toHaveBeenCalled();
    expect(WebMidi.getOutputByName).toHaveBeenCalledWith(
      "Microsoft GS Wavetable Synth",
    );
    expect(mockSendNoteOn).toHaveBeenCalledWith(params.note, {
      channels: params.channel,
    });
    expect(res).toEqual({ succes: true });
  });
});
describe("midiProgramChangeOn", () => {
  it("Wyślij sygnał do Midi sendProgramChange -ON", async () => {
    const mockSendProgramChange = jest.fn();

    const params = {
      note: 4,
      noteOnOff: "pressed",
      channel: 1,
      playMethod: "ProgramChange",
      chosenOutput: "Microsoft GS Wavetable Synth",
    };
    (WebMidi.getOutputByName as jest.Mock).mockReturnValue({
      sendProgramChange: mockSendProgramChange,
    });
    const res = await midiTest.midi(params);

    expect(WebMidi.enable).toHaveBeenCalled();
    expect(WebMidi.getOutputByName).toHaveBeenCalledWith(
      "Microsoft GS Wavetable Synth",
    );
    expect(mockSendProgramChange).toHaveBeenCalledWith(params.note * 2, {
      channels: params.channel,
    });
    expect(res).toEqual({ succes: true });
  });
});
describe("midiProgramChangeOn", () => {
  it("Wyślij sygnał do Midi sendProgramChange -ON", async () => {
    const mockSendProgramChange = jest.fn();

    const params = {
      note: 4,
      noteOnOff: "released",
      channel: 1,
      playMethod: "ProgramChange",
      chosenOutput: "Microsoft GS Wavetable Synth",
    };
    (WebMidi.getOutputByName as jest.Mock).mockReturnValue({
      sendProgramChange: mockSendProgramChange,
    });
    const res = await midiTest.midi(params);

    expect(WebMidi.enable).toHaveBeenCalled();
    expect(WebMidi.getOutputByName).toHaveBeenCalledWith(
      "Microsoft GS Wavetable Synth",
    );
    expect(mockSendProgramChange).toHaveBeenCalledWith(params.note * 2 + 1, {
      channels: params.channel,
    });
    expect(res).toEqual({ succes: true });
  });
});
