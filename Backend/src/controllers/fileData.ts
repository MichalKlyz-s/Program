import * as fs from "fs";
import { join } from "path";
export const getOrgansData = () => {
  try {
    const organsDataJSON = fs.readFileSync("./organsConfig.txt", "utf-8");
    const organsData = JSON.parse(organsDataJSON);
    return organsData;
  } catch (err) {
    console.error(err);
    return "Error";
  }
};
// Do poprawy spawdzenie reszty zmiennych w sensie transpozytor itp
export const savesetting = async (settingsData: any) => {
  if (
    typeof settingsData === "object" &&
    typeof settingsData.confName === "string" &&
    typeof settingsData.organName === "string" &&
    typeof settingsData.addres === "string" &&
    (settingsData.playMethod === "MiDi" ||
      settingsData.playMethod === "ProgramChange") &&
    (settingsData.playMethodButtons === "MiDi" ||
      settingsData.playMethodButtons === "ProgramChange") &&
    (settingsData.chanelForManuals > 0 || settingsData.chanelForManuals < 17) &&
    Array.isArray(settingsData.manuals) &&
    (settingsData.chanelForpedal > 0 || settingsData.chanelForpedal < 17) &&
    Array.isArray(settingsData.pedal) &&
    (settingsData.chanelForKopples > 0 || settingsData.chanelForKopples < 17) &&
    Array.isArray(settingsData.kopples) &&
    Array.isArray(settingsData.voices) &&
    (settingsData.chanelForAddons > 0 || settingsData.chanelForAddons < 17) &&
    Array.isArray(settingsData.addons)
  ) {
    try {
      const settingsToSave = JSON.stringify(settingsData);
      fs.writeFileSync(
        "./organsSettings/" + settingsData.confName + ".txt",
        settingsToSave,
        "utf-8",
      );
      return true;
    } catch (err) {
      console.error(err);
      return "Error";
    }
  }
  throw new Error("error");
};

export const getsetting = async (fileName: any) => {
  try {
    const file = fs.readFileSync("./organsSettings/" + fileName, "utf-8");
    const configuration = JSON.parse(file);
    return configuration;
  } catch (err) {
    console.error(err);
    return "Error";
  }
};
export const useSetting = async (fileName: any) => {
  try {
    const chosenFile = fs.readFileSync("./organsSettings/" + fileName, "utf-8");
    fs.writeFileSync("./organsConfig.txt", chosenFile, "utf-8");
    const chosenFileData = JSON.parse(chosenFile);
    return chosenFileData;
  } catch (err) {
    console.error(err);
    return "Error";
  }
};
export const getFileList = async () => {
  const files = fs
    .readdirSync("./organsSettings", { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
  return files;
};
