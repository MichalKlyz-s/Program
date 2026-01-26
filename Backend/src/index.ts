import express, { response } from 'express'
import cors from 'cors';
import {getOrgansData, savesetting, getsetting, useSetting, getFileList} from "./controllers/fileData"
import * as midi from './controllers/midi';

const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(8888, async () => {
  const serverAddress =  await server.address();
  console.log('Aplikacja wystartowała', serverAddress)
});

app.post('/savesetting', async (params, response) => {
  if(params.body.data){
    try{
      await savesetting(params.body.data)
      response.send({'success': true})
      response.status(200).end();
    }
    catch (err) {
      console.error(err);
      return 'Error';
    };
  }
  else{
    response.send({'success': false})
    response.status(400).end();
  }
});

app.get('/getsetting', async (params, response) => {
  if(params.query.data){
    try{
      const conf = await getsetting(params.query.data)
      response.send({'success': true, conf});
      response.status(200).end();
    }
    catch (err) {
      console.error(err);
      return 'Error';
    }
  }
  else{
    response.send({'success': false})
    response.status(400).end();
  }
});

app.get('/usesetting', async (params, response) => {
  if(params.query.data){
    try {
      const conf = await useSetting(params.query.data);
      response.send({'success': true, conf});
      response.status(200).end();
    }     catch (err) {
      console.error(err);
      return 'Error';
    }
  }
  else{
    response.send({'success': false})
    response.status(400).end();
  }
});

app.get('/getallsettingsfiles', async (URLSearchParams, response) =>{
  try {
    const files = await getFileList();
    response.send({'success': true, files});
  } catch (err) {
    console.error(err);
    response.send({'success': false});
    return 'Error';
  }
});

app.get('/listentoinput', async(params, response) => {
  if(params.query.data != ''){
    try {
      const listentest = await midi.listenToMidi(params.query.data);
      // console.log(listentest)
    } catch (err) {
      console.error(err);
      response.send({'success': false});
      return 'Error';
    }
  }
});

app.get('/getData', async (params, response) => {
  try {
    const configuration = await getOrgansData();
    response.send({'success': true, configuration});
    response.status(200).end();
  } catch (error) {
    console.error(error)
    return 'Error';
  }
});

app.get('/getinputs', async (params, response) => {
  try {
    const inputs = await midi.getsInputsList();
    response.send({'success': true, inputs});
  } catch (error) {
    console.error(error)
    return 'Error';
  }
});

app.get('/getoutputs', async (params, response) => {
  try {
    const outputs = await midi.getsOutputsList();
    response.send({'success': true, outputs});
  } catch (error) {
    console.error(error)
    return 'Error';
  }
});

app.get('/choseoutput', async (params, response) => {
  if(params.query.data){
    try {
      await midi.choseMidi(params.query.data)
      response.send({'success': true})
      response.status(200).end();
    } catch (error) {
      console.error(error)
      return 'Error';
    }
  }
  else{
    response.send({'success': false})
    response.status(400).end();
  }
});

app.get('/choseinput', async (params, response) => {
  if(params.query.data){
    try {
      await midi.choseMidiinput(params.query.data)
      response.send({'success': true})
      response.status(200).end();
    } catch (error) {
      console.error(error)
      return 'Error';
    }
  }
  else {
    response.send({'success': false})
    response.status(400).end();
  }
});

app.get('/midi', async (params, response) => {
  if(params.query.data){
    try {
      await midi.midi(params.query.data)
      response.send({'success': true})
      response.status(200).end();
    } catch (error) {
      console.error(error)
      return 'Error';
    }
  }
  else {
    response.send({'success': false})
    response.status(400).end();
  }
});