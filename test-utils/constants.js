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
