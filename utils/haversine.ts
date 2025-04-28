export function haversine([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]): number | null {
    const toRad = (d: number) => (d * Math.PI) / 180
    const R = 6371 // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.asin(Math.sqrt(a))
    
    return R * c * 1000 // Returns the distance in meters
  }
  