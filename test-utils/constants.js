/**
 * @function VOLUNTEER
 * @description Returns a volunteer object with properties with given issues. Leave variants empty to return a volunteer object with no issues.
 * @param {string[]} variants - The variants of the volunteer object to return. Possible variants are:
 *  - "name-null" - returns a volunteer object with the name property set to null
 *  - "name-undefined" - returns a volunteer object with the name property set to undefined
 *  - "email-null" - returns a volunteer object with the email property set to null
 *  - "email-undefined" - returns a volunteer object with the email property set to undefined
 *  - "phone-null" - returns a volunteer object with the phone property set to null
 *  - "phone-undefined" - returns a volunteer object with the phone property set to undefined
 *  - "referral-null" - returns a volunteer object with the referral property set to null
 *  - "referral-undefined" - returns a volunteer object with the referral property set to undefined
 * @returns {Object} - A volunteer object with properties:
 *  - name {string|null|undefined} - the name of the volunteer
 *  - email {string|null|undefined} - the email of the volunteer
 *  - phone {string|null|undefined} - the phone number of the volunteer
 *  - referral {string|null|undefined} - the referral source of the volunteer
 */
export const VOLUNTEER = (variants = []) => {
  // Holy terinaries batman!
  return {
    name: variants.includes("name-null")
      ? null
      : variants.includes("name-undefined")
      ? undefined
      : "Jack Crane",
    email: variants.includes("email-null")
      ? null
      : variants.includes("email-undefined")
      ? undefined
      : "email@example.com",
    phone: variants.includes("phone-null")
      ? null
      : variants.includes("phone-undefined")
      ? undefined
      : "1234567890",
    referral: variants.includes("referral-null")
      ? null
      : variants.includes("referral-undefined")
      ? undefined
      : "referral",
  };
};

/**
 * @function SHIRT_SIZE
 * @description Returns a shirt size object
 */
export const SHIRT_SIZE = () => {
  return {
    name: "Small",
    slug: "small",
  };
};

/**
 * @function SHIFT
 * @description Returns a shift object. Leave variants empty to return a shift object with no issues.
 * @param {string[]} variants - The variants of the shift object to return. Possible variants are:
 * - "name-null" - returns a shift object with the name property set to null
 * - "name-undefined" - returns a shift object with the name property set to undefined
 * - "date-null" - returns a shift object with the date property set to null
 * - "date-undefined" - returns a shift object with the date property set to undefined
 * - "startTime-null" - returns a shift object with the startTime property set to null
 * - "startTime-undefined" - returns a shift object with the startTime property set to undefined
 * - "endTime-null" - returns a shift object with the endTime property set to null
 * - "endTime-undefined" - returns a shift object with the endTime property set to undefined
 * - "description-null" - returns a shift object with the description property set to null
 * - "description-undefined" - returns a shift object with the description property set to undefined
 * @returns {Object} - A shift object with properties:
 * - name {string|null|undefined} - the name of the shift
 * - date {Date|null|undefined} - the date of the shift
 * - startTime {Date|null|undefined} - the start time of the shift
 * - endTime {Date|null|undefined} - the end time of the shift
 * - description {string|null|undefined} - the description of the shift
 */
export const SHIFT = (variants = []) => {
  return {
    name: variants.includes("name-null")
      ? null
      : variants.includes("name-undefined")
      ? undefined
      : "Shift 1",
    date: variants.includes("date-null")
      ? null
      : variants.includes("date-undefined")
      ? undefined
      : new Date(),
    startTime: variants.includes("startTime-null")
      ? null
      : variants.includes("startTime-undefined")
      ? undefined
      : new Date(),
    endTime: variants.includes("endTime-null")
      ? null
      : variants.includes("endTime-undefined")
      ? undefined
      : new Date(),
    description: variants.includes("description-null")
      ? null
      : variants.includes("description-undefined")
      ? undefined
      : "Description",
  };
};

/**
 * @function RESTRICTION
 * @description Returns a restriction object
 * @returns {Object} - A restriction object with properties:
 * - name {string} - the name of the restriction
 */
export const RESTRICTION = () => {
  return {
    name: "Must be 21+",
  };
};
