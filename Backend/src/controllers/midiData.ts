
const exampleData =
[
    {'generaldata': {'Name': 'example', 'Location': 'Politechnika', 'NumberOfVoices': 14, 'ChangeOfVoice': true, 'NumberOfManuals': 3, 'Kople': true},
    'Keyboard': {
    'Manuals': [{'id': 0, 'Start': 0, 'End': 114},  {'id': 1, 'Start': 0, 'End': 100}], //możliwa potrzeba dodania kanału
    'Pedals': {'Start': 0, 'End': 40}, //możliwa potrzeba dodania kanału
    },
    'OrgansDisposition': {
        'Name': 'example',
        'Voices': [{'id': 0, 'Name': 'Nazard', 'Arg': 12, 'ManRef': 0},{'id': 1, 'Name': 'Flute', 'Arg': 13, 'ManRef': 1}], 'NumbersToShow': [], 'NumbersForSwitch': [],
    },   // Dodać sposób przełączania głosów  nodeON/oFF czy programchange
},
{}]

export const chosenData = () => {
return exampleData;
}