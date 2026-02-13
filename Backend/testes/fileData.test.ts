import * as fileData from "../src/controllers/fileData";
import fs from "fs";

jest.mock("fs");

describe("loadConfigMocked", () => {
  it("Pobiera konfigurację", () => {
    const mockGettingConfig = fs.readFileSync as jest.Mock;
    mockGettingConfig.mockReturnValue('{ "confName": "MainOrgans" }');
    const res = fileData.getOrgansData();
    expect(mockGettingConfig).toHaveBeenCalledWith(
      "./organsConfig.txt",
      "utf-8",
    );
    expect(res.confName).toBe("MainOrgans");
  });
});
describe("saveConfigMocked", () => {
  it("Zapisanie konfiguracji do pliku", () => {
    const spySavingConfig = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

    const settingsToSave = {
      confName: "Template",
      organName: "Drewniane",
      addres: "Wschodnia 6, Łódź",
      playMethod: "MiDi",
      playMethodButtons: "ProgramChange",
      chanelForManuals: 1,
      manuals: [
        { id: 1, range: ["36", "96"], chanel: 1, transpozytor: "normal" },
        { id: 2, range: ["36", "96"], chanel: 2, transpozytor: "normal" },
      ],
      chanelForpedal: 3,
      pedal: [36, 67],
      chanelForKopples: 4,
      kopples: [
        { id: 1, name: "II/I", firstManual: 2, secondManual: 1 },
        { id: 2, name: "1/P", firstManual: 1, secondManual: 0 },
      ],
      voices: [
        { id: 1, name: "2 ft Fifteenth", button: "2", channel: "7" },
        { id: 2, name: "V Mixture", button: "8", channel: "8" },
      ],
      chanelForAddons: 12,
      addons: [
        { id: 1, name: "Restart", button: "2" },
        { id: 2, name: "Next", button: "3" },
        { id: 3, name: "VolumeUp", button: "5" },
      ],
    };
    fileData.savesetting(settingsToSave);

    const args = (fs.writeFileSync as jest.Mock).mock.calls[0];
    const savedData = JSON.parse(args[1]);

    expect(savedData).toEqual(settingsToSave);
    expect(args[0]).toBe(
      "./organsSettings/" + settingsToSave.confName + ".txt",
    );
    expect(args[2]).toBe("utf-8");
    spySavingConfig.mockRestore();
  });
});
describe("saveConfigMockedNotEnoughtData", () => {
  it("Zapisanie konfiguracji do pliku, brak danych", async () => {
    const spySavingConfig = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {
        throw new Error("error");
      });
    const settingsToSave = {
      confName: "Template",
      organName: "Drewniane",
    };

    await expect(fileData.savesetting(settingsToSave)).rejects.toThrow("error");
    spySavingConfig.mockRestore();
  });
});
describe("loadSelectedConfigMocked", () => {
  it("Pobiera wybraną konfigurację", async () => {
    const mockGettingConfig = fs.readFileSync as jest.Mock;
    const dataToTest = "Template.txt";
    mockGettingConfig.mockReturnValue('{ "confName": "Template" }');
    const res = await fileData.getsetting(dataToTest);
    expect(mockGettingConfig).toHaveBeenCalledWith(
      "./organsSettings/" + dataToTest,
      "utf-8",
    );
    expect(res.confName).toBe("Template");
  });
});
describe("useConfigMocked", () => {
  it("Użyj wybranej konfiguracji", async () => {
    const mockGettingConfig = fs.readFileSync as jest.Mock;
    mockGettingConfig.mockReturnValue('{"confName":"MainOrgans"}');
    const dataName = "MainOrgans.txt";
    const spySavingConfig = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});
    const res = await fileData.useSetting(dataName);
    const args = (fs.writeFileSync as jest.Mock).mock.calls[0];
    expect(mockGettingConfig).toHaveBeenCalledWith(
      "./organsSettings/" + dataName,
      "utf-8",
    );
    expect(spySavingConfig).toHaveBeenCalledWith(
      "./organsConfig.txt",
      args[1],
      "utf-8",
    );
    expect(res).toEqual({ confName: "MainOrgans" });
    mockGettingConfig.mockRestore();
    spySavingConfig.mockRestore();
  });
});
