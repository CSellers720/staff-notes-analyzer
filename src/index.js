const path = require('path');
const fs = require('fs');

const week = /^W04/
// do not include file extensions in file names
// make sure inputFile is of format .tsv
const inputFileName = 'tickets';
const outputFileName = 'w05output';
const maxTagsInSprint = 5;
const maxTagsInTags = 10;
const interactionsToExclude = ['Tactical Discussion', 'Accountability', 'Whiteboarding'];
const sprintsToExclude = ['Accountability', 'Other', 'Soft Skills/Checkins'];
const tagsToExclude = ['no-relevant-tags', 'react'];

var outputObj = { tags: [] };

fs.promises.readFile(path.resolve(__dirname, `../data/${inputFileName}.tsv`))
  .then((results) => {
    let allResults = results.toString().split('\r');
    for (var i = 1; i < allResults.length; i++) {
      //split each row
      const newRow = allResults[i].split('\t');
      //console.log('newRow: ', newRow);
      //check if the row matches the filter conditions (week, interactions, sprints, tags)
      if(isValidTicket(newRow)) {
        //add tag count to outputObj in the appropriate place
        sprintUpsert(outputObj, newRow[10], newRow[12].split(' '));
      }
    }
    sortOutput(outputObj);
    console.log(outputObj);
    return fs.promises.writeFile(path.resolve(__dirname, `../data/${outputFileName}.json`), JSON.stringify(outputObj, null, 2));
  })
  .then(() => {
    console.log('File written successfully');
  })
  .catch((err) => {
    console.log('an error occurred ', err);
  });

  //checks whether a ticket meets the filter conditions
  const isValidTicket = (row) => {
    const isValidWeek = row[4].search(week) !== -1;
    const isInvalidInteraction = interactionsToExclude.includes(row[5]);
    const isInvalidSprint = sprintsToExclude.includes(row[10]);
    return isValidWeek && !isInvalidInteraction && !isInvalidSprint;
  }

  //takes in the output Object, a rows sprint and tags
  //adds the sprint and tags to the output object
  const sprintUpsert = (object, sprint, tags) => {
    for (tag of tags) {
      //check if current tag is to be excluded
      const isInvalidTag = tagsToExclude.includes(tag);
      if (!isInvalidTag) {
        //check if tag exists in tags array
        const tagsArrayIndex = object.tags.findIndex((el) => el.name === tag);
        if(tagsArrayIndex !== -1) {
          //if yes, total++
          object.tags[tagsArrayIndex].total++;
        } else {
          //if not, create it with tag object with total of 1
          object.tags.push({ name: tag, total: 1 });
        }

        //check to see if the sprint is already a key of the output object
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
  }

  const sortOutput = (object) => {
    //iterate through all properties
    for (const key in object) {
      //run sort on each array
      object[key].sort((a, b) => {
        return b.total - a.total;
      });
      //set array length to remove tags beyond the max
      if(key === 'tags') {
        object[key].length = (object[key].length < maxTagsInTags) ? object[key].length : maxTagsInTags;
      } else {
        object[key].length = (object[key].length < maxTagsInSprint) ? object[key].length : maxTagsInSprint;
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
// sortOutput(testObj3);
//console.log('testObj3 ', testObj3);


/*
Week: 4
Flag: 9,
Sprint: 10,
Tag: 12

*/