import axios from "axios";

export const fetchSentinelImage = async (lat, lng) => {
  const url = `https://api.satellite-hub.com/get-image?lat=${lat}&lng=${lng}&key=YOUR_SENTINEL_API_KEY`;

  const res = await axios.get(url);
  return res.data.imageUrl;
};
