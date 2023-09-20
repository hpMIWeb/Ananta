export const getMinWidth = (dataIndex) => {
    if (
      [
        "firmName",
        "clientType",
        "firmType",
        "panNumber",
        "gstin",
        "industryType",
        "lineOfBusiness",
        "groupName",
        "fileNumber",
        "address",
        "pinCode",
        "country",
        "state",
        "city",
        "firstName",
        "middleName",
        "lastName",
        "gender",
        "dateOfBirth",
        "emailId",
        "mobile",
        "altMobile",
        "referredBy"
      ].includes(dataIndex)
    ) {
      return "200px"; // Set a minimum width for specific columns
    }
    return "50px";
  };