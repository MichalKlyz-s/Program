import express from 'express'
import cors from 'cors';
import * as fs from 'fs';
import {hay} from './hello';
import * as midi from './controllers/midi'
const app = express();

app.use(cors());

app.get('/midi', async (req, response) => {
    // console.log(req);
    // response.send({'success': true})
    // console.log(midi.midi('test', 'test'))
    await response.send(midi.midi('test', 'test'));
    // response.status(200).end();
})
app.listen(8888, () => {
    console.log('Aplikacja wystartowała')
});
console.log(hay)