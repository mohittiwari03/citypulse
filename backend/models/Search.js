import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    weather: {
      temp: Number,
      feels_like: Number,
      humidity: Number,
      description: String,
      icon: String,
      wind_speed: Number,
      country: String,
    },
    newsHeadlines: [String],
  },
  { timestamps: true }
);

const Search = mongoose.model("Search", searchSchema);
export default Search;
