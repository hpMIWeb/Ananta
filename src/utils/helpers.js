import Cookies from "js-cookie";
export const apiEndpoint =
    "https://api.staging.nccountant.com/api/v1/" ||
    process.env.REACT_APP_API_ENDPOINT;

export const getAuthToken = Cookies.get("jwt_token");

const compareIgnoreCaseWithTypo = (str1, str2) => {
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
                const cost =
                    normalizedStr1[i - 1] === normalizedStr2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
    }

   

    return matrix[normalizedStr1.length][normalizedStr2.length] <= tolerance;
};

const customSort = (a, b, sortState) => {
            switch (sortState.type) {
        case "Latest":
            if (sortState.sortOrder === "Latest") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            break;
        case "Name":
            const nameA =
                a.plan_name?.toUpperCase() || a.add_on_title?.toUpperCase() || a.firmName?.toUpperCase() || a.firstName?.toUpperCase();
            const nameB =
                b.plan_name?.toUpperCase() || b.add_on_title?.toUpperCase() || b.firmName?.toUpperCase() || b.firstName?.toUpperCase();

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
        case "Client":
            const clientA = a.assignClients.length || 0;
            const clientB = b.assignClients.length || 0;

            if (sortState.sortOrder === "Highest") {
                return clientB - clientA;
            } else if (sortState.sortOrder === "Lowest") {
                return clientA - clientB;
            }
            break;
        default:
            break;
    }

    return 0; // Default to no sorting
};

const customFilter = (sortedValues, addonFilterState) => {
    const fieldName = addonFilterState.type;
    const filterValue = addonFilterState.value;
   
    if (filterValue && fieldName) {
    return sortedValues.filter((value) => {
      // Check if the field specified in fieldName exists in the data
      if (value.hasOwnProperty(fieldName)) {
        return value[fieldName] === filterValue;
      }
      return false;
    });
  } else {
    return sortedValues;
  }
    
    
}

// export const getFilteredValue = (
//     data,
//     searchValue,
//     sortState,
//     addonFilterState,
// ) => {
    
   
//     const searchedValues = data.filter((card) => {
//         return Object.values(card).some((value) =>
//             value !== null && value.toString().toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1
//         );
//     });
    

//     const sortedValues = searchedValues.sort((a, b) =>
//         customSort(a, b, sortState)
//     );
//     const newAddOnValue = addonFilterState.value === "all" ? "" : addonFilterState.value;
   
//     if (newAddOnValue) {
//         return customFilter(sortedValues,addonFilterState)
//     } else {
//         return sortedValues;
//     }

    
// };

// export const getFilteredValue = (data, searchValue, sortState, addonFilterState) => {
  

//     // Filter data based on searchValue
//     let searchedValues = data;
//     console.log("data",data)
//     if (searchValue) {
//          searchedValues = data.filter((card) => {
//             // Ensure that card is not undefined
//             return (
//             card &&
//             Object.values(card).some((value) =>
//                 value !== null && value.toString().toLowerCase().includes(searchValue?.toLowerCase())
//             )
//             );
//         });
//     }
  

//   // Sort the filtered data based on sortState
//   const sortedValues = searchedValues.sort((a, b) => customSort(a, b, sortState));

//     // Apply addon filter if a value is selected
//     console.log("addonFilterState",addonFilterState)
//     if (addonFilterState && addonFilterState.value!=='') {
//       return customFilter(sortedValues, addonFilterState);
//   } else {
//     return sortedValues;
//   }
// };

export const getFilteredValue = (data, searchValue, sortState, addonFilterState) => {
  // Create a copy of the original data to avoid modifying it directly
  let filteredData = [...data];

  // Filter data based on searchValue
  if (searchValue) {
    filteredData = filteredData.filter((card) => {
      return (
        card &&
        Object.values(card).some((value) =>
          value !== null && value.toString().toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    });
  }

  // Sort the filtered data based on sortState
  filteredData.sort((a, b) => customSort(a, b, sortState));

  // Apply addon filter if a value is selected
  if (addonFilterState && addonFilterState.value !== '') {
    filteredData = customFilter(filteredData, addonFilterState);
  }

  return filteredData;
};



export const filterObjectByKey = (object, keysArray) => {
    const filteredObject = {};

    keysArray.forEach((key) => {
        if (object.hasOwnProperty(key)) {
            filteredObject[key] = object[key];
        }
    });

    return filteredObject;
};

export const amountDigitFixed = (amount, fixedValue = 2) => {
    return amount.toFixed(fixedValue);
};

export const displayNumberInCurrencyFormate = (
    amount,
    country = "en-IN",
    currencyType = "INR"
) => {
    return amount
        ? new Intl.NumberFormat(country, {
              style: "currency",
              currency: currencyType,
          }).format(amount)
        : " 0";
};
