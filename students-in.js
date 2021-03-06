/**
 * this script is run from commandline to insert HH.com product data into local MongoDB
 *
 */
var ItemProvider = require('./itemprovider-mongodb').ItemProvider,
    itemProvider = new ItemProvider(),
    uuid = require('uuid'),
    data = require('./students').results;

var i = 0, l = data.length, date = Date.now();

var majors = ["Agriculture","Agriculture Operations","Architecture","Area","Ethnic","Cultural","Gender","Aviation","Biological and Biomedical Sciences","Business","Management","Marketing","Communication","Journalism","Communications Technologies","Computer and Information Sciences","Construction Trades","Education","Engineering Technologies","Engineering","English Language","Family and Consumer Sciences","Foreign Languages","Literatures","Health Professions","History","Homeland Security","Law Enforcement","Firefighting","Human Services","Legal Professions","Liberal Arts","Humanities","Library Science","Mathematics and Statistics","Mechanic and Repair Technologies","Military Technologies and Applied Sciences","Multi/interdisciplinary Studies","Natural Resources and Conservation","Parks"," Recreation"," Leisure and Fitness Studies","Personal and Culinary Services","Philosophy and Religious Studies","Physical Sciences","Precision Production","Psychology","Science Technologies","Social Sciences","Theology and Religious Vocations","Transportation and Materials Moving","Visual and Performing Arts"];
var admins = ["Wayne Patterson","Barb Manolakes","Joe Chrisman","Sophie Roney","Brett Welsh"];

function getRandomFloatInclusive(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function capitalizeAll(str) {
	return str
			.replace(/  +/g, ' ')
			.split(' ')
			.map(function (word) {
				return word.charAt(0).toUpperCase() + word.slice(1)
			})
			.join(' ');
}
// iterate over our product data and insert into MongoDB
function saveToDb() {
  data[i].sid = uuid.v4();
  data[i].gpa = getRandomFloatInclusive(2.5, 4.0).toFixed(1);
  data[i].major = majors[getRandomIntInclusive(0, majors.length - 1)];
  data[i].modified = date;
  data[i].modifiedby = admins[getRandomIntInclusive(0, admins.length - 1)];
  delete data[i].name.title;
	data[i].name.first = capitalizeAll(data[i].name.first);
	data[i].name.last = capitalizeAll(data[i].name.last);
	data[i].location.street = capitalizeAll(data[i].location.street);
	data[i].location.city = capitalizeAll(data[i].location.city);
	data[i].location.state = capitalizeAll(data[i].location.state);
  delete data[i].picture.thumbnail;
  delete data[i].picture.medium;

  itemProvider.saveItem({ collection: 'students', student: data[i] })
    .then(res => {
      console.log('saved: ' + data[i].sid, i + '/' + l);
      return i < data.length - 1 ? (i++ , void saveToDb()) : void process.exit();
    });
}

// open DB -> insert items into DB
itemProvider.open(function(err, db){
  console.log('db: ', db);
  if (err) {
    console.log(err);
    return;
  }
  const coll = db.collection('students');
  coll.createIndex({ sid: 1 }, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    saveToDb();
  });
});
