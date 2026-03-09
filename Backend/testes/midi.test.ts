import easymidi from "easymidi";
import * as midiTest from "../src/controllers/midi";

jest.mock("easymidi", () => ({
  easymidi: {
    getOutputs: jest.fn(),
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
    const res = await midiTest.getsOutputsList();
    expect(res).toEqual([
      "Microsoft GS Wavetable Synth",
      "Linux GS Wavetable Synth",
    ]);
    expect(easymidi.getOutputs).toHaveBeenCalled();
  });
});
describe("midiSendNoteON", () => {
  it("Wyślij sygnał do Midi sendNoteOn", async () => {
    const mockSendNoteOn = jest.fn();
    const params = {
      note: [4],
      noteOnOff: "pressed",
      channel: [1],
      playMethod: "MiDi",
      chosenOutput: "Microsoft GS Wavetable Synth",
    };
    (easymidi.getOutputs as jest.Mock).mockReturnValue({
      sendNoteOn: mockSendNoteOn,
    });
    const res = await midiTest.midi(params);

    expect(easymidi.getOutputs).toHaveBeenCalledWith(
      "Microsoft GS Wavetable Synth",
    );
    expect(mockSendNoteOn).toHaveBeenCalledWith(params.note[0], {
      channels: params.channel[0],
    });
    expect(res).toEqual({ succes: true });
  });
});
describe("midiProgramChangeOn", () => {
  it("Wyślij sygnał do Midi sendProgramChange -ON", async () => {
    const mockSendProgramChange = jest.fn();

    const params = {
      note: [4],
      noteOnOff: "pressed",
      channel: [1],
      playMethod: "ProgramChange",
      chosenOutput: "Microsoft GS Wavetable Synth",
    };
    (easymidi.getOutputs as jest.Mock).mockReturnValue({
      sendProgramChange: mockSendProgramChange,
    });
    const res = await midiTest.midi(params);

    expect(easymidi.getOutputs).toHaveBeenCalledWith(
      "Microsoft GS Wavetable Synth",
    );
    expect(mockSendProgramChange).toHaveBeenCalledWith(params.note[0] * 2, {
      channels: params.channel[0],
    });
    expect(res).toEqual({ succes: true });
  });
});
describe("midiProgramChangeOff", () => {
  it("Wyślij sygnał do Midi sendProgramChange -OFF", async () => {
    const mockSendProgramChange = jest.fn();

    const params = {
      note: [4],
      noteOnOff: "released",
      channel: [1],
      playMethod: "ProgramChange",
      chosenOutput: "Microsoft GS Wavetable Synth",
    };
    (easymidi.getOutputs as jest.Mock).mockReturnValue({
      sendProgramChange: mockSendProgramChange,
    });

    const res = await midiTest.midi(params);

    expect(easymidi.getOutputs).toHaveBeenCalledWith(
      "Microsoft GS Wavetable Synth",
    );
    expect(mockSendProgramChange).toHaveBeenCalledWith(params.note[0] * 2 + 1, {
      channels: params.channel[0],
    });
    expect(res).toEqual({ succes: true });
  });
});
