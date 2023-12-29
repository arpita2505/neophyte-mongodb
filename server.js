
const database = require('./mongo.js');
const mongoose = require("mongoose");

async function main() {
  await database.init();

  if (database.connection) {
    console.log('Connection state:', database.connection.host);
  }

  const AnalysisCollection = mongoose.model('analysis_collection', {
    _id: String,
    timestamps: Date,
    img_url: String,
    user_id: String,
    shelf_id: String,
    bay_id:String,
    brand_id:String,
    part_id:String,
    fullness: Number,
    old_img_url: String,
    total_objects_detected: Number,
    tray_det_bboxes: Array,
    updatedAt: Date,
    store_id: String
  });

  const startOfDay = new Date("2023-12-18T17:37:20.704+00:00");

  try {
    const result = await AnalysisCollection.aggregate([
     {
        $match: {
          timestamps: { $gte: startOfDay }
        }
      },
      {
        $group: {
          _id: null,
          averageFullness: { $avg: "$fullness" },
          data: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          _id: 0,
          extractedSet: {
            $map: {
              input: "$data",
              as: "item",
              in: {
                img_url: "$$item.img_url",
                store: "$$item.store_id",
                // averageFullness: "$averageFullness"
              }
            }
          }
        }
      }
    ]).exec();

    console.log(result);

  } catch (error) {
   console.error('Error executing aggregation:', error);
  }
}

main();

