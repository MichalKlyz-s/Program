import * as fs from 'fs';
import { join } from 'path';

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

export const getOrgansData = () => {
return exampleData();
}