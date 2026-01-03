/**
 * Generate Employee ID in format: OI[XX][YYYY][NNNN]
 * OI = Company code
 * XX = First 2 letters of first name + First 2 letters of last name
 * YYYY = Year of joining
 * NNNN = Serial number for that year (4 digits, zero-padded)
 */

/**
 * Generate employee ID
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} joiningDate - Joining date (YYYY-MM-DD)
 * @param {number} serialNumber - Serial number for that year
 * @returns {string} Employee ID
 */
export function generateEmployeeId(firstName, lastName, joiningDate, serialNumber) {
  const year = new Date(joiningDate).getFullYear();
  const namePrefix = (
    (firstName.substring(0, 2) + lastName.substring(0, 2))
  ).toUpperCase();
  const serial = serialNumber.toString().padStart(4, '0');
  
  return `OI${namePrefix}${year}${serial}`;
}

/**
 * Extract year and serial from existing employee IDs
 * Used to determine next serial number for a given year
 */
export function parseEmployeeId(employeeId) {
  const match = employeeId.match(/^OI([A-Z]{4})(\d{4})(\d{4})$/);
  if (!match) return null;
  
  return {
    namePrefix: match[1],
    year: parseInt(match[2]),
    serial: parseInt(match[3])
  };
}

