
const GetPairs = (pairs) => {
    const result = {};
    for (const [key, value] of pairs) {
      result[key] = value;
    }
    return result;
  }

  export default GetPairs;