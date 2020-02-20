/**
 * @author wpatterson
 */
const C = require('./config.js');
const MongoClient = require('mongodb').MongoClient;

const ItemProvider = function() {};

// Connection URL
const url = `mongodb://${C.host}:${C.port}/${C.name}`;

// Create a new MongoClient
const client = new MongoClient(url);

// Open connection to DB server
ItemProvider.prototype.open = function(cb) {
  MongoClient.connect(url, (err, db) => {
    if(err) {
      cb(err);
    } else {
      console.log(db);
      this.db = db;
      cb();
    }
  });
};

// find items in collection
ItemProvider.prototype.findItems = function(o) {
  return new Promise((resolve, reject) => {
    const collection = this.db.collection(o.collection);
    collection.find(o.query, o.fields).sort(o.sort || { _id: -1 }).limit(o.limit || 0).toArray((err, results) =>{
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    })
  });

};

// find single item
ItemProvider.prototype.findOne = function(o) {
  return new Promise((resolve, reject) => {
    const collection = this.db.collection(o.collection);
    collection.find(o.query).limit(1).toArray((err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// save item or items
ItemProvider.prototype.save = function(o, items) {
  return new Promise((resolve, reject) => {
    const collection = this.db.collection(o.collection);

  })

    this.getCollection(o.collection || 'items', function(error, collection) {
      if( error ) callback(error)
      else {
        if( typeof(items.length)=="undefined") {
          items = [items];
        }
        /*for( var i =0;i< items.length;i++ ) {
          item = items[i];
          item.ratings = {};
          item.created_at = new Date();
        }*/
        collection.insert(items, function() {
          callback(null, items);
        });
      }
    });
};

// update item or items
ItemProvider.prototype.updateItem = function(o) {
  return new Promise((resolve, reject) => {
    const collection = this.db.collection(o.collection);
    col.updateOne(o.query, o.action, function (err, result) {
      if (err) {
        reject(err);
      } else if (result.matchedCount === 0 || result.modifiedCount === 0) {
        resolve({'error': 'not found'});
      } else {
        collection.find(o.query).limit(1).toArray((err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      }
    });
  });
};

// delete item or items
ItemProvider.prototype.deleteItem = function(o) {
  return new Promise((resolve, reject) => {
    const collection = this.db.collection(o.collection);
    collection.deleteOne(o.query, (err, r) => {
      if (err) {
        reject(err);
      } else {
        resolve({ ok: r.result.ok, deletedCount: r.deletedCount });
      }
    })
  });
}

exports.ItemProvider = ItemProvider;