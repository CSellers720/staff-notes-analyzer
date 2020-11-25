const path = require('path');
const fs = require('fs');

const week = /^W02/;
var outputObj = {};

fs.promises.readFile(path.resolve(__dirname, '../data/sn-w02.tsv'))
  .then((results) => {
    let allResults = results.toString().split('\r');
    for (var i = 1; i < allResults.length; i++) {
      //split each row
      const newRow = allResults[i].split('\t');
      //check if the row's week matches const week
      if(newRow[4].search(week) !== -1) {
        sprintUpsert(outputObj, newRow[10], newRow[12].split(' '));
      }
    }
    console.log(outputObj);
  })
  .catch((err) => {
    console.log('an error occurred ', err);
  });

  const sprintUpsert = (object, sprint, tags) => {
    for (tag of tags) {
      //check to see if sprint is key of object
      if(object[sprint]) {
        //if yes, check if tag is a key of sprint
        if(object[sprint][tag]) {
          //if yes, total++
          object[sprint][tag].total++;
        } else {
          //if not, create it with tag object with total of 1
          object[sprint][tag] = { total: 1 };
        }
      } else {
        //create new sprint object with total prop = 1
        object[sprint] = {};
        object[sprint][tag] = { total: 1 };
      }
    }
  }

// var test = [
//   '\n5/11/2020 11:42:52',
//   'mariah.tato@galvanize.com',
//   'Nicolas Yarosz',
//   'Warner Lin',
//   'W01D1',
//   'Help Desk Request',
//   'Nicolas',
//   'Technical issue with Nic only. ',
//   "Nic accidentally added himself as a remote pair. Told them to try a quick google search to solve issue, didn't work so I suggested they delete and reclone their repos and try again to not waste time google searching. ",
//   'Green',
//   'Orientation and Precourse Review',
//   '',
//   'git'
// ];

// var testObj1 = {};
// sprintUpsert(testObj1, 'Orientation and Precourse Review', 'git');
// console.log('testObj1 ', testObj1);

// var testObj2 = {
//   'Orientation and Precourse Review': {}
// };
// sprintUpsert(testObj2, 'Orientation and Precourse Review', 'git');
// console.log('testObj2 ', testObj2);


// var testObj3 = {
//   'Orientation and Precourse Review': {
//     'git': {
//       total: 1
//     }
//   }
// }

// sprintUpsert(testObj3, 'Orientation and Precourse Review', 'git');
// console.log('testObj3 ', testObj3);


/*
Week: 4
Flag: 9,
Sprint: 10,
Tag: 12


w** = {
  totals: {
    tagName1: {
      total: q,
      red: q,
      yel: q,
      grn: q,
    },
    tagName2: {
      total: q,
      red: q,
      yel: q,
      grn: q,
    },
  },
  sprintName1: {
    tagName: {
      total: q,
      red: q,
      yel: q,
      grn: q,
    }
  },
  sprintName2*: {...}
}
*/