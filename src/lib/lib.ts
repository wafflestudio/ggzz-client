import { TLLCoordinates, TMapInfo, TXYCoordinates } from "../lib/types/locationTypes";

export const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const LLToXY = (
  { lng, lat }: TLLCoordinates,
  { width, height, centerLLCoordinates }: TMapInfo
): TXYCoordinates => {
  const { lng: cLng } = centerLLCoordinates;
  const LLRadius = 0.1;
  const minLng = cLng - LLRadius;
  const maxLng = cLng + LLRadius;

  const x = (lng - minLng) * (width / (maxLng - minLng));

  const latRad = deg2rad(lat);
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (width * mercN) / (2 * Math.PI);

  return { x, y };
};

export const getDistanceFromLatLngInM = (
  { lat: lat1, lng: lng1 }: TLLCoordinates,
  { lat: lat2, lng: lng2 }: TLLCoordinates
) => {
  const earthRadius = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = earthRadius * c * 1000; // Distance in m
  return d;
};
