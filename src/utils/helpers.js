import Cookies from "js-cookie";
export const apiEndpoint =
  "https://api.staging.nccountant.com/api/v1/" ||
  process.env.REACT_APP_API_ENDPOINT;

export const getAuthToken = Cookies.get("jwt_token");

const compareIgnoreCaseWithTypo =(str1, str2) => {
  const tolerance = 2; // Adjust this value based on the allowed typo tolerance
  const normalizedStr1 = str1?.toLowerCase();
  const normalizedStr2 = str2?.toLowerCase();

  // Calculate the Levenshtein distance between the two strings
  const matrix = Array(normalizedStr1.length + 1)
    .fill()
    .map(() => Array(normalizedStr2.length + 1).fill(0));

  for (let i = 0; i <= normalizedStr1.length; i++) {
    for (let j = 0; j <= normalizedStr2.length; j++) {
      if (i === 0) {
        matrix[i][j] = j;
      } else if (j === 0) {
        matrix[i][j] = i;
      } else {
        const cost = normalizedStr1[i - 1] === normalizedStr2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
  }

  return matrix[normalizedStr1.length][normalizedStr2.length] <= tolerance;
}

const customSort = (a, b, sortState) => {
  switch (sortState.type) {
    case "Latest":
      if (sortState.sortOrder === "Latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      break;
    case "Name":
      const nameA = a.plan_name?.toUpperCase() || a.add_on_title?.toUpperCase();
      const nameB = b.plan_name?.toUpperCase() || b.add_on_title?.toUpperCase();

      if (sortState.sortOrder === "Ascending") {
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
      } else if (sortState.sortOrder === "Descending") {
        if (nameA > nameB) return -1;
        if (nameA < nameB) return 1;
      }
      break;
    case "Price":
      const priceA = a.price;
      const priceB = b.price;

      if (sortState.sortOrder === "Highest") {
        return priceB - priceA;
      } else if (sortState.sortOrder === "Lowest") {
        return priceA - priceB;
      }
      break;
    case "Subscribers": // Add sorting for Subscribers column
      const subscribersA = a.subscribers || 0;
      const subscribersB = b.subscribers || 0;

      if (sortState.sortOrder === "Highest") {
        return subscribersB - subscribersA;
      } else if (sortState.sortOrder === "Lowest") {
        return subscribersA - subscribersB;
      }
      break;
    default:
      break;
  }

  return 0; // Default to no sorting
};


export const getFilteredValue = (data, searchValue, sortState, addOnValue) => {
    const searchedValues = data.filter((card) => {
      return Object.values(card).some((value) =>
        compareIgnoreCaseWithTypo(String(value), searchValue?.toLowerCase())
      );
    });

  const sortedValues = searchedValues.sort((a, b) =>
    customSort(a, b, sortState)
  );
  const newAddOnValue = addOnValue === "All Addons" ? "" : addOnValue;
  if (newAddOnValue) {
    const addOnFilteredValues = sortedValues.filter(
      (value) => value.add_on_type === newAddOnValue
    );
    return addOnFilteredValues;
  }

  return sortedValues;
};

export const filterObjectByKey =(object, keysArray) => {
  const filteredObject = {};

  keysArray.forEach(key => {
    if (object.hasOwnProperty(key)) {
      filteredObject[key] = object[key];
    }
  });

  return filteredObject;
}
