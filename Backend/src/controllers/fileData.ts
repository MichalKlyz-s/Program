import * as fs from 'fs';
import { join } from 'path';

// Dodać walidację danych pobieranych z pliku oraz samego pliku
// Dodać metodę do zapisu pliku

const exampleData = () => {
    try {
        const organsDataJSON = fs.readFileSync(join(__dirname, '../../organsConfig.txt'), 'utf-8')
        const organsData = JSON.parse(organsDataJSON);
        return organsData
      } catch (err) {
        console.error(err);
        return 'Error';
      }
}

const saveCreatedConfig = () => {
  try {
    // fs.mkdir
    // W pracy to mam
      const organsDataJSON = fs.readFileSync(join(__dirname, '../../organsConfig.txt'), 'utf-8')
      const organsData = JSON.parse(organsDataJSON);
      return organsData
    } catch (err) {
      console.error(err);
      return 'Error';
    }
}

export const getOrgansData = () => {
return exampleData();
}