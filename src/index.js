const path = require('path');
const fs = require('fs');

const week = /^W02/;
var outputObj = { tags: [] };

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
      //check if tag exists in tags array
      const tagsArrayIndex = object.tags.findIndex((el) => el.name === tag);
      if(tagsArrayIndex !== -1) {
        //if yes, total++
        object.tags[tagsArrayIndex].total++;
      } else {
        //if not, create it with tag object with total of 1
        object.tags.push({ name: tag, total: 1 });
      }

      //check to see if sprint is key of object
      if(object[sprint]) {
        //if yes, check if tag exists in the sprint array
        const tagIndex = object[sprint].findIndex((el) => el.name === tag);
        if(tagIndex !== -1) {
          //if yes, total++
          object[sprint][tagIndex].total++;
        } else {
          //if not, create it with tag object with total of 1
          object[sprint].push({ name: tag, total: 1 });
        }
      } else {
        //create new sprint object with total prop = 1
        object[sprint] = [{ name: tag, total: 1 }];
      }
    }
  }

  /*
  outputObj = {
    tags: [
      {
        name: tag1,
        total: 5
      },
      {
        name: tag2,
        total: 2
      }
    ],
    sprint1: [
      {
        name: tag1,
        total: 15
      },
      {
        name: tag2,
        total: 10
      }
    ],
    sprint2: [ ** ]
}*/

// break out totals for each tag in the tags object
// Helper Fn: determine the top 5 tags
  // create a temp array
  // iterate through the tags object

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
// sprintUpsert(testObj1, 'Orientation and Precourse Review', ['git']);
// console.log('testObj1 ', testObj1);

// var testObj2 = {
//   'Orientation and Precourse Review': []
// };
// sprintUpsert(testObj2, 'Orientation and Precourse Review', ['git']);
// console.log('testObj2 ', testObj2);


// var testObj3 = {
//   'Orientation and Precourse Review': [
//     {
//       name: 'git',
//       total: 2
//     }
//   ]
// }

// sprintUpsert(testObj3, 'Orientation and Precourse Review', ['git']);
// console.log('testObj3 ', testObj3);


/*
Week: 4
Flag: 9,
Sprint: 10,
Tag: 12

*/