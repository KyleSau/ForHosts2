export const RESERVATION_STATUS = {
  ALL: "all",
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED"
}

export const RESERVATION_FUTURE_DAYS_THRESHOLD = 90;

export const TIME_FACTORS = {
  MS_PER_DAY:  1000 * 3600 * 24, // number of ms -> 1 day
  MS_PER_HOUR: 1000 * 3600, // number of ms -> 1 hour
  MS_PER_MINUTE: 1000 * 60, //number of ms -> 1 minute
  MS_PER_SECOND: 1000 // number of ms -> 1 second
}

export const FILE_CONSTS = {
  FILE: "file",
  JPEG: "image/jpeg",
  PNG: "image/png"
}

export const IMAGE_UPLOAD_QUANTITY_LIMIT = 10;
export const IMAGE_SIZE_LIMIT_MB = 10;
export const IMAGE_SIZE_LIMIT_BYTES = IMAGE_SIZE_LIMIT_MB * 1e6;
